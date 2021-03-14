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
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as Icon } from "../../../assets/companyAddress.svg";
import "../../styles/detail-style.css";
import "../../styles/navbar-style.css";

const AddressDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [siteMode, setSiteMode] = useState("watch");

  const [item, setItem] = useState(null);
  const [selectListItems, setSelectListItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (accessToken) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/CompanyAddress/${props.match.params.id}`,
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
        .get(`${process.env.REACT_APP_API_URL}/api/Company`, {
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
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [props.match.params.id, accessToken]);
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
  const validate = (values) => {
    const errors = {};
    if (!values.StreetName) {
      errors.StreetName = "Nutné vyplnit ulici!";
    }
    if (!values.HouseNumber) {
      errors.HouseNumber = "Nutné vyplnit číslo popisné!";
    }
    if (!values.City) {
      errors.City = "Nutné vyplnit město!";
    }
    if (!values.PostalCode) {
      errors.PostalCode = "Nutné vyplnit poštovní směrovací číslo!";
    }
    if (!values.CompanyId) {
      errors.CompanyId = "Nutné vybrat firmu";
    }
    if (!values.Latitude) {
      errors.Latitude = "Nutné vyplnit";
    }
    if (!values.Longtitude) {
      errors.Longtitude = "Nutné vyplnit";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      StreetName:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.streetName
          : "",
      HouseNumber:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.houseNumber
          : "",
      City:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.city
          : "",
      PostalCode:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.postalCode
          : "",
      Headquarter:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.headquarter
          : "",
      CompanyId:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companyId
          : "",
      Longtitude:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.longtitude
          : "",
      Latitude:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.latitude
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/CompanyAddress/${item.id}`,
          {
            StreetName: values.StreetName,
            HouseNumber: values.HouseNumber,
            City: values.City,
            PostalCode: values.PostalCode,
            Headquarter: values.Headquarter,
            Longtitude: values.Longtitude,
            Latitude: values.Latitude,
            CompanyId: parseInt(values.CompanyId),
            FreeForInspection: item.freeForInspection,
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
          <Navbar profile={profile} active_item="Companies">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Companies">
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
                                <h3 style={{ color: "#A9A9A9" }}>Firma</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.company.name}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>Ulice</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.streetName}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>ČP</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.houseNumber}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>Město </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.city}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>PSČ </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.postalCode}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>LAT</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.latitude}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>LOG </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.longtitude}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>
                                  Hlavní sídlo{" "}
                                </h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  <FontAwesomeIcon
                                    icon={item.headquarter ? faCheck : null}
                                    color="#ffffff"
                                    className="check-icon "
                                  ></FontAwesomeIcon>
                                </h2>
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
                          history.push("/companies");
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
            <Navbar profile={profile} active_item="Companies">
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
                                  <Label>Ulice</Label>
                                  <Input
                                    id="StreetName"
                                    name="StreetName"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.StreetName}
                                  />
                                  {formik.errors.StreetName &&
                                  formik.touched.StreetName ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.StreetName}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Číslo popisné</Label>
                                  <Input
                                    id="HouseNumber"
                                    name="HouseNumber"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.HouseNumber}
                                  />
                                  {formik.errors.HouseNumber &&
                                  formik.touched.HouseNumber ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.HouseNumber}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Město</Label>
                                  <Input
                                    id="City"
                                    name="City"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.City}
                                  />
                                  {formik.errors.City && formik.touched.City ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.City}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>PSČ</Label>
                                  <Input
                                    id="PostalCode"
                                    name="PostalCode"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.PostalCode}
                                  />
                                  {formik.errors.PostalCode &&
                                  formik.touched.PostalCode ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.PostalCode}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Latitude</Label>
                                  <Input
                                    id="Latitude"
                                    name="Latitude"
                                    type="number"
                                    step="any"
                                    placeholder="50.08804"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    checked={formik.values.Latitude}
                                    value={formik.values.Latitude}
                                  />
                                  {formik.errors.Latitude &&
                                  formik.touched.Latitude ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Latitude}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Longtitude</Label>
                                  <Input
                                    id="Longtitude"
                                    name="Longtitude"
                                    type="number"
                                    step="any"
                                    placeholder=" 14.42076"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.Longtitude}
                                  />
                                  {formik.errors.Longtitude &&
                                  formik.touched.Longtitude ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.Longtitude}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Firma praxe</Label>
                                  <Input
                                    name="CompanyId"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.CompanyId}
                                  >
                                    <option value="">Vybrat firmu...</option>
                                    {renderSelectListItems()}
                                  </Input>
                                  {formik.errors.CompanyId &&
                                  formik.touched.CompanyId ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.CompanyId}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup check>
                                  <Label check>
                                    <Input
                                      id="Headquarter"
                                      name="Headquarter"
                                      type="checkbox"
                                      onChange={formik.handleChange}
                                      onBlur={formik.handleBlur}
                                      checked={formik.values.Headquarter}
                                    />
                                    {formik.errors.Headquarter &&
                                    formik.touched.Headquarter ? (
                                      <Alert
                                        style={{ marginTop: "10px" }}
                                        color="danger"
                                      >
                                        {formik.errors.Headquarter}
                                      </Alert>
                                    ) : null}
                                    Hlavní sídlo firmy
                                  </Label>
                                </FormGroup>
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
          <Navbar profile={profile} active_item="Companies">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Companies">
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
export default AddressDetail;
