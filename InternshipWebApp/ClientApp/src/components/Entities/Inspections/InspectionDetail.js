import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading.js";
import Unauthorized from "../../messages/Unauthorized.js";
import Error from "../../messages/Error.js";

import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Jumbotron,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";

import { ReactComponent as Icon } from "../../../assets/classroomIcon.svg";
import "../../styles/navbar-style.css";
import "../../styles/detail-style.css";

const InspectionDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState();

  useEffect(() => {
    setLoading(true);

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Internship`)
      .then((response) => {
        response.data.forEach((item) => {
          if (item.id === parseInt(props.match.params.id)) {
            axios
              .get(
                `${process.env.REACT_APP_API_URL}/api/Inspection/${item.inspection.id}`
              )
              .then((response) => {
                setItem(response.data);
              })
              .catch((error) => {
                setError(true);
              });
          }
        });
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [siteMode, props.match.params.id]);
  const validate = (values) => {
    const errors = {};
    if (!values.AdditionalInformations) {
      errors.AdditionalInformations = "Nutné vyplnit!";
    }
    if (values.InspectionRating === "") {
      errors.InspectionRating = "Nunté vybrat hodnocení";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      AdditionalInformations:
        typeof props.location.state !== "undefined"
          ? props.location.state.additionalInformations
          : "",
      InspectionRating:
        typeof props.location.state !== "undefined"
          ? props.location.state.inspectionRating
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/inspection/${item.id}`,
          {
            InspectionDate: new Date(),
            AdditionalInformations: values.AdditionalInformations,
            InspectionRating: parseInt(values.InspectionRating),
            InternshipId: parseInt(props.match.params.id),
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setItem(response.data);
          setSiteMode("watch");
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    },
  });
  const renderDate = (date) => {
    date = new Date(date);
    var month = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDate();
    var datum = day + "." + month + "." + year;
    return datum;
  };
  if (accessToken) {
    if (
      profile.hasOwnProperty("internship_administrator") ||
      profile.hasOwnProperty("internship_controller")
    ) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Internships">
              <Container>
                <Row className="justify-content-center">
                  <Col sm="12" lg="7" md="10" className="text-center">
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      <Container>
                        <Row>
                          <Col
                            xs="12"
                            sm="12"
                            lg="12"
                            md="12"
                            style={{
                              wordWrap: "break-word",
                              paddingTop: "20px",
                            }}
                            className="text-right my-auto"
                          >
                            <Row>
                              <Col xs="6" sm="6" lg="6" md="6">
                                <Icon
                                  fill="white"
                                  style={{
                                    color: "white",
                                    height: "50px",
                                    width: "auto",
                                  }}
                                ></Icon>
                              </Col>
                              <Col
                                xs="6"
                                sm="6"
                                lg="6"
                                md="6"
                                className="text-left my-auto"
                              >
                                <h3>{item.id}</h3>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Informace</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.additionalInformations}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Hodnocení</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.inspectionRating + 1}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Datum</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{renderDate(item.inspectionDate)}</h2>
                              </Col>
                            </Row>
                            <hr />
                          </Col>
                        </Row>
                      </Container>
                    </Jumbotron>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col sm="12" lg="6" md="6" className="text-right">
                    <Form>
                      <Button
                        size="lg"
                        color="primary"
                        onClick={() => {
                          setSiteMode("edit");
                        }}
                        style={{ margin: 5 }}
                      >
                        Upravit
                      </Button>
                      <Button
                        size="lg"
                        color="danger"
                        onClick={() => {
                          history.push("/internships");
                        }}
                        style={{ margin: 5 }}
                      >
                        Zpět
                      </Button>
                    </Form>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        } else if (siteMode === "edit") {
          return (
            <Navbar profile={profile} active_item="Internships">
              <Container>
                <Row className="justify-content-center">
                  <Col sm="12" lg="7" md="10" className="text-center">
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      <Container>
                        <Row>
                          <Col sm="12" lg="12" md="12">
                            <Form onSubmit={formik.handleSubmit}>
                              <FormGroup>
                                <FormGroup>
                                  <Label>Informace o praxi</Label>
                                  <Input
                                    id="AdditionalInformations"
                                    name="AdditionalInformations"
                                    type="textarea"
                                    placeholder="Student vykonával úspěšně..."
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.AdditionalInformations}
                                  />
                                  {formik.errors.AdditionalInformations &&
                                  formik.touched.AdditionalInformations ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.AdditionalInformations}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Hodnocení</Label>
                                  <Input
                                    id="InspectionRating"
                                    name="InspectionRating"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.InspectionRating}
                                  >
                                    <option value="">
                                      Vybrat hodnocení...
                                    </option>
                                    <option value={0}>Výborný</option>
                                    <option value={1}>Chvalitebný</option>
                                    <option value={2}>Dobrý</option>
                                    <option value={3}>Dostačující</option>
                                    <option value={4}>Nedostačující</option>
                                  </Input>
                                  {formik.errors.InspectionRating &&
                                  formik.touched.InspectionRating ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.InspectionRating}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                              </FormGroup>
                              <Button
                                type="submit"
                                color="success"
                                variant="primary"
                              >
                                Upravit
                              </Button>
                              <Button
                                color="danger"
                                onClick={() => {
                                  setSiteMode("watch");
                                }}
                                style={{ margin: 5 }}
                              >
                                Zpět
                              </Button>
                            </Form>
                          </Col>
                        </Row>
                      </Container>
                    </Jumbotron>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        }
      } else {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Internships">
          <Unauthorized />
        </Navbar>
      );
    }
  } else {
    return (
      <MessageLayout>
        <Login />
      </MessageLayout>
    );
  }
};
export default InspectionDetail;
