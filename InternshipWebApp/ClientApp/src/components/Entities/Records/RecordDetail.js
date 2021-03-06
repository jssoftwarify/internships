import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Error from "../../messages/Error.js";
import Loading from "../../Pages/Loading.js";
import Unauthorized from "../../messages/Unauthorized.js";

import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Jumbotron,
  Alert,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

import { ReactComponent as Icon } from "../../../assets/calendar.svg";
import "../../styles/detail-style.css";

const RecordDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/Record/${props.match.params.id}`
      )
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [props.match.params.id]);

  const validate = (values) => {
    const errors = {};
    if (!values.hours) {
      errors.hours = "Nutné vyplnit počet hodin!";
    }
    if (parseInt(values.hours) > 24) {
      errors.hours = "Hodnota přesahuje 24 hodin!";
    }
    if (!values.description) {
      errors.description = "Nutné vyplnit popis práce!";
    }
    if (!values.date) {
      errors.date = "Nutné vyplnit datum";
    }
    var date_regex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
    if (!date_regex.test(values.date)) {
      errors.date = "Nutné zadat datum ve spávném formátu";
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      hours:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.numberOfHours
          : "",
      description:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.workDescription
          : "",
      date:
        typeof props.location.state !== "undefined"
          ? formatDate(props.location.state.item.dateOfRecord)
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/Record/${item.id}`,
          {
            NumberOfHours: values.hours.toString(),
            WorkDescription: values.description,
            DateOfRecord: new Date(values.date).toISOString(),
            InternshipId: item.internshipId,
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
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    var datum = day + "." + month + "." + year;
    return datum;
  };
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  if (accessToken) {
    if (
      profile.hasOwnProperty("internship_administrator") |
      profile.hasOwnProperty("internship_student")
    ) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Denik">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Denik ">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Denik">
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
                                lg="3"
                                md="3"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Počet hodin
                                </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.numberOfHours}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="3"
                                md="3"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Datum záznamu
                                </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{renderDate(item.dateOfRecord)}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="3"
                                md="3"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Popis práce
                                </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.workDescription}</h2>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Jumbotron>
                    <Row>
                      <Col sm="12" lg="12" md="12" className="text-right">
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
                              history.push("/records");
                            }}
                            style={{ margin: 5 }}
                          >
                            Zpět
                          </Button>
                        </Form>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        } else if (siteMode === "edit") {
          return (
            <Navbar profile={profile} active_item="Denik">
              <Container>
                <Row className="justify-content-center">
                  <Col sm="12" lg="6" md="6" className="text-center">
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
                            style={{ color: "white" }}
                            sm="12"
                            lg="12"
                            md="12"
                          >
                            <Form onSubmit={formik.handleSubmit}>
                              <FormGroup>
                                <Label>Počet hodin</Label>
                                <Input
                                  id="hours"
                                  name="hours"
                                  type="number"
                                  placeholder="7"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.hours}
                                />
                                {formik.errors.hours && formik.touched.hours ? (
                                  <Alert
                                    style={{ marginTop: "10px" }}
                                    color="danger"
                                  >
                                    {formik.errors.hours}
                                  </Alert>
                                ) : null}
                              </FormGroup>
                              <FormGroup>
                                <Label>Datum záznamu</Label>
                                <Input
                                  id="date"
                                  name="date"
                                  type="date"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.date}
                                />
                                {formik.errors.date && formik.touched.date ? (
                                  <Alert
                                    style={{ marginTop: "10px" }}
                                    color="danger"
                                  >
                                    {formik.errors.date}
                                  </Alert>
                                ) : null}
                              </FormGroup>
                              <FormGroup>
                                <Label>Popis práce</Label>
                                <Input
                                  id="description"
                                  name="description"
                                  type="textarea"
                                  placeholder="Práce na webové aplikaci"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.description}
                                />
                                {formik.errors.description &&
                                formik.touched.description ? (
                                  <Alert
                                    style={{ marginTop: "10px" }}
                                    color="danger"
                                  >
                                    {formik.errors.description}
                                  </Alert>
                                ) : null}
                              </FormGroup>
                              <Button
                                type="submit"
                                color="success"
                                variant="success"
                                size="lg"
                                style={{ margin: 5 }}
                              >
                                Uložit
                              </Button>
                              <Button
                                color="danger"
                                size="lg"
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
          <Navbar profile={profile} active_item="Denik">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Denik">
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

export default RecordDetail;
