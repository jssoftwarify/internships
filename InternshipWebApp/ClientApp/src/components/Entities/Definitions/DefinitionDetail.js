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
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ReactComponent as Icon } from "../../../assets/definitionIcon.svg";
import "../../styles/navbar-style.css";
import "../../styles/detail-style.css";

const DefinitionDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectListItems, setSelectListItems] = useState([]);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (accessToken) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition/${props.match.params.id}`,
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
        });

      axios
        .get(`${process.env.REACT_APP_API_URL}/api/Classroom`, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setSelectListItems(response.data);
        })
        .catch((error) => {
          setError(true);
        });
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/professionalExperienceDefinition/getClassrooms/${props.match.params.id}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setIds(response.data);
        })
        .catch((error) => {
          setError(true);
        });

      axios
        .get(`${process.env.REACT_APP_API_URL}/api/classroom`, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setClassrooms(response.data);
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
    if (!values.Nazev) {
      errors.Nazev = "Nutné vyplnit název!";
    }
    if (!values.Zacatek) {
      errors.Zacatek = "Nutné vyplnit začátek praxe!";
    }
    if (!values.Konec) {
      errors.Konec = "Nutné vyplnit konec praxe!";
    }
    if (!values.Rok) {
      errors.Rok = "Nutné vyplnit rok!";
    }
    if (!values.Dny) {
      errors.Dny = "Nutné vyplnit počet dní!";
    }
    if (!values.Hodiny) {
      errors.Hodiny = "Nutné vyplnit počet hodin!";
    }
    if (!values.ClassroomIds) {
      errors.ClassroomIds = "Nutné vybrat třídu!";
    }
    if (!values.representative) {
      errors.representative = "Nutné vyplnit jméno zástupce!";
    }
    if (!values.representativeEmail) {
      errors.representativeEmail = "Nutné vyplnit e-mail zástupce firmy!";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.representativeEmail
      )
    ) {
      errors.representativeEmail = "Nesprávný e-mail!";
    }

    if (!values.representativeNumber) {
      errors.representativeNumber = "Nutné vyplnit telefonní číslo zástupce!";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      Nazev:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.name
          : "",
      Zacatek:
        typeof props.location.state !== "undefined"
          ? formatDate(props.location.state.item.start)
          : "",
      Konec:
        typeof props.location.state !== "undefined"
          ? formatDate(props.location.state.item.end)
          : "",
      Rok:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.year
          : "",
      Dny:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.numberOfDays
          : "",
      Hodiny:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.numberOfHours
          : "",
      Active:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.active
          : "",
      Longtime:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.longtime
          : "",
      representative:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.definitionRepresentative
          : "",
      representativeEmail:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.definitionRepresentativeEmail
          : "",
      representativeNumber:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.definitionRepresentativeTelephoneNumber
          : "",
      ClassroomIds: [],
    },
    validate,
    onSubmit: async (values) => {
      console.log(values);
      const idArray = values.ClassroomIds.map((item) => parseInt(item));
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/professionalExperienceDefinition/${item.id}`,
          {
            Name: values.Nazev,
            Start: values.Zacatek,
            End: values.Konec,
            Year: values.Rok,
            NumberOfDays: values.Dny,
            NumberOfHours: values.Hodiny,
            Active: values.Active,
            Longtime: values.Longtime,
            ClassroomIds: idArray,
            DefinitionRepresentative: values.representative,
            DefinitionRepresentativeEmail: values.representativeEmail,
            DefinitionRepresentativeTelephoneNumber:
              values.representativeNumber,
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          history.push("/definitions");
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
  function renderSelectListItems() {
    const array = selectListItems.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return array;
  }
  if (accessToken) {
    if (profile.hasOwnProperty("internship_administrator")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Definitions">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Definitions">
            <Loading />
          </Navbar>
        );
      } else if (item && classrooms && ids) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Definitions">
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
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Název</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.name}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Začátek</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{renderDate(item.start)}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Konec</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{renderDate(item.end)}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Rok</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.year}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Počet dní</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.numberOfDays}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Počet hodin
                                </h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.numberOfHours}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Jméno zástupce
                                </h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.definitionRepresentative}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Email zástupce
                                </h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.definitionRepresentativeEmail}</h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Telefonní číslo zástupce
                                </h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  {item.definitionRepresentativeTelephoneNumber}
                                </h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Třídy</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  {ids.map((item) => {
                                    var isEqual = false;
                                    var name = "";
                                    classrooms.forEach((cs) => {
                                      if (cs.id === item.classroomId) {
                                        isEqual = true;
                                        name = cs.name;
                                      }
                                    });
                                    if (isEqual) {
                                      return <span key={name}>{name}, </span>;
                                    } else {
                                      return null;
                                    }
                                  })}
                                </h2>
                              </Col>
                            </Row>
                            <hr />

                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Aktivní</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  {item.active ? (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      color="#ffffff"
                                      className="check-icon"
                                    ></FontAwesomeIcon>
                                  ) : (
                                    ""
                                  )}
                                </h2>
                              </Col>
                            </Row>
                            <hr />
                            <Row>
                              <Col
                                xs="5"
                                sm="5"
                                lg="4"
                                md="4"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Dlouhodobá</h3>
                              </Col>
                              <Col
                                xs="7"
                                sm="7"
                                lg="8"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  {item.longtime ? (
                                    <FontAwesomeIcon
                                      icon={faCheck}
                                      color="#ffffff"
                                      className="check-icon"
                                    ></FontAwesomeIcon>
                                  ) : (
                                    ""
                                  )}
                                </h2>
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
                              history.push("/definitions");
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
            <Navbar profile={profile} active_item="Definitions">
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
                                <FormGroup>
                                  <Label>Název definice</Label>
                                  <Input
                                    id="Nazev"
                                    name="Nazev"
                                    type="text"
                                    placeholder="Čtvrtý ročník"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Nazev}
                                  />
                                  {formik.errors.Nazev &&
                                  formik.touched.Nazev ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Nazev}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Začátek praxe</Label>
                                  <Input
                                    id="Zacatek"
                                    name="Zacatek"
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Zacatek}
                                  />
                                  {formik.errors.Zacatek &&
                                  formik.touched.Zacatek ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Zacatek}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Konec praxe</Label>
                                  <Input
                                    id="Konec"
                                    name="Konec"
                                    type="date"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Konec}
                                  />
                                  {formik.errors.Konec &&
                                  formik.touched.Konec ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Konec}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Rok</Label>
                                  <Input
                                    id="Rok"
                                    name="Rok"
                                    type="number"
                                    placeholder="2020"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Rok}
                                  />
                                  {formik.errors.Rok && formik.touched.Rok ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Rok}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Počet dní</Label>
                                  <Input
                                    id="Dny"
                                    name="Dny"
                                    type="number"
                                    placeholder="10"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Dny}
                                  />
                                  {formik.errors.Dny && formik.touched.Dny ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Dny}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Počet hodin</Label>
                                  <Input
                                    id="Hodiny"
                                    name="Hodiny"
                                    type="number"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Hodiny}
                                  />
                                  {formik.errors.Hodiny &&
                                  formik.touched.Hodiny ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Hodiny}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>třída</Label>
                                  <Input
                                    name="ClassroomIds"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.ClassroomIds}
                                    multiple
                                  >
                                    <option value="">Vybrat třídu...</option>
                                    {renderSelectListItems()}
                                  </Input>
                                  {formik.errors.ClassroomIds &&
                                  formik.touched.ClassroomIds ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.ClassroomIds}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Jméno zástupce</Label>
                                  <Input
                                    id="representative"
                                    name="representative"
                                    type="text"
                                    placeholder="Radek Havlík"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.representative}
                                  />
                                  {formik.errors.representative &&
                                  formik.touched.representative ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.representative}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Email zástupce</Label>
                                  <Input
                                    id="representativeEmail"
                                    name="representativeEmail"
                                    type="text"
                                    placeholder="radek.havlik@pslib.cz"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.representativeEmail}
                                  />
                                  {formik.errors.representativeEmail &&
                                  formik.touched.representativeEmail ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.representativeEmail}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Telefonní číslo zástupce</Label>
                                  <Input
                                    id="representativeNumber"
                                    name="representativeNumber"
                                    type="text"
                                    placeholder="+420 485 100 113"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.representativeNumber}
                                  />
                                  {formik.errors.representativeNumber &&
                                  formik.touched.representativeNumber ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.representativeNumber}
                                    </Alert>
                                  ) : null}
                                </FormGroup>

                                <Row>
                                  <Col>
                                    <FormGroup check>
                                      <Label check>
                                        <Input
                                          id="Active"
                                          name="Active"
                                          type="checkbox"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.Active}
                                        />
                                        {formik.errors.Active &&
                                        formik.touched.Active ? (
                                          <Alert
                                            style={{ marginTop: "10px" }}
                                            color="danger"
                                          >
                                            {formik.errors.Active}
                                          </Alert>
                                        ) : null}
                                        Aktivní
                                      </Label>
                                    </FormGroup>
                                  </Col>
                                  <Col>
                                    <FormGroup check>
                                      <Label check>
                                        <Input
                                          id="Longtime"
                                          name="Longtime"
                                          type="checkbox"
                                          onChange={formik.handleChange}
                                          onBlur={formik.handleBlur}
                                          checked={formik.values.Longtime}
                                        />
                                        {formik.errors.Longtime &&
                                        formik.touched.Longtime ? (
                                          <Alert
                                            style={{ marginTop: "10px" }}
                                            color="danger"
                                          >
                                            {formik.errors.Longtime}
                                          </Alert>
                                        ) : null}
                                        Dlouhodobá
                                      </Label>
                                    </FormGroup>
                                  </Col>
                                </Row>
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
          <Navbar profile={profile} active_item="Definitions">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Definitions">
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
export default DefinitionDetail;
