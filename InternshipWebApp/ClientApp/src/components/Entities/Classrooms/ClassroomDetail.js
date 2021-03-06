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

const ClassroomDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState(null);
  const [selectListItems, setSelectListItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/Classroom/${props.match.params.id}`
      )
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => {
        setError(true);
      });
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition`
      )
      .then((response) => {
        setSelectListItems(response.data);
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
    if (!values.nazev) {
      errors.nazev = "Nutné vyplnit!";
    } else if (values.nazev.length > 5) {
      errors.nazev = "Název musí být maximálně 5 znaků dlouhý";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      nazev:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.name
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/classroom/${item.id}`,
          {
            Name: values.nazev,
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

  if (accessToken) {
    if (profile.hasOwnProperty("internship_administrator")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Classrooms">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Classrooms">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Classrooms">
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
                            <Row className="align-items-center">
                              <Col
                                xs="4"
                                sm="4"
                                lg="3"
                                md="3"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Název</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.name}</h2>
                              </Col>
                            </Row>
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
                          history.push("/classrooms");
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
            <Navbar profile={profile} active_item="Classrooms">
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
                                <Label>Název třídy</Label>
                                <Input
                                  id="nazev"
                                  name="nazev"
                                  type="text"
                                  placeholder="P4"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.nazev}
                                />
                                {formik.errors.nazev && formik.touched.nazev ? (
                                  <Alert
                                    style={{ marginTop: "10px" }}
                                    color="danger"
                                  >
                                    {formik.errors.nazev}
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
          <Navbar profile={profile} active_item="Classrooms">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Classrooms">
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
export default ClassroomDetail;
