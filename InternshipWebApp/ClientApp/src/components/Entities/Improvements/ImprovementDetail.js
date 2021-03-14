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
  Input,
  Label,
  Alert,
  FormGroup,
} from "reactstrap";

import { ReactComponent as Icon } from "../../../assets/zlepsovakIcon.svg";
import "../../styles/navbar-style.css";
import "../../styles/detail-style.css";

const ImprovementDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState(null);

  useEffect(() => {
    setLoading(true);
    if (accessToken) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/Improvement/${props.match.params.id}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
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
    }
  }, [props.match.params.id, accessToken]);

  const validate = (values) => {
    const errors = {};
    if (!values.nazev) {
      errors.nazev = "Nutné vyplnit název!";
    }
    if (!values.telo) {
      errors.telo = "Nutné vyplnit tělo!";
    }
    if (!values.status) {
      errors.status = "Nutné vybrat status!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      nazev:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.head
          : "",
      telo:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.body
          : "",
      status:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.status
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/Improvement/${item.id}`,
          {
            Head: values.nazev,
            Body: values.telo,
            Status: values.status,
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
    if (
      profile.hasOwnProperty("internship_administrator") |
      profile.hasOwnProperty("internship_student") |
      profile.hasOwnProperty("internship_controler")
    ) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Improvements">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Improvements">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Improvements">
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
                                <h3 style={{ color: "#A9A9A9" }}>Název</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.head}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="3"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Tělo</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.body}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="4"
                                sm="4"
                                lg="3"
                                md="4"
                                className="my-auto"
                              >
                                <h3
                                  style={{
                                    color: "#A9A9A9",
                                  }}
                                >
                                  Status
                                </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.status}</h2>
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
                          history.push("/improvements");
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
        } else if (
          (siteMode === "edit") &
          profile.hasOwnProperty("internship_administrator")
        ) {
          return (
            <Navbar profile={profile} active_item="Improvements">
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
                            sm="12"
                            lg="12"
                            md="12"
                            style={{ paddingTop: "20px" }}
                          >
                            <Form onSubmit={formik.handleSubmit}>
                              <FormGroup>
                                <FormGroup>
                                  <Label>Název</Label>
                                  <Input
                                    id="nazev"
                                    name="nazev"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.nazev}
                                  />
                                  {formik.errors.nazev &&
                                  formik.touched.nazev ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.nazev}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Tělo</Label>
                                  <Input
                                    id="telo"
                                    name="telo"
                                    type="textarea"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.telo}
                                  />
                                  {formik.errors.telo && formik.touched.telo ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.telo}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Status</Label>
                                  <Input
                                    id="status"
                                    name="status"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.status}
                                  >
                                    <option value="">Vybrat definic</option>
                                    <option value="Hotovo">Hotovo</option>
                                    <option value="Zpracováváno">
                                      Zpracováváno
                                    </option>
                                    <option value="Nezpracováno">
                                      Nezpracováno
                                    </option>
                                  </Input>
                                  {formik.errors.status &&
                                  formik.touched.status ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.status}
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
                    <Col sm="12" lg="12" md="12" className="text-right"></Col>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        } else {
          return (
            <Navbar profile={profile} active_item="Improvements">
              <Unauthorized />
            </Navbar>
          );
        }
      } else {
        return (
          <Navbar profile={profile} active_item="Improvements">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Improvements">
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
export default ImprovementDetail;
