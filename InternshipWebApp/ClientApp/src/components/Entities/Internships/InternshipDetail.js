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
  Label,
  Input,
  FormGroup,
  Alert,
} from "reactstrap";

import { ReactComponent as Icon } from "../../../assets/praxeIcon.svg";
import "../../styles/navbar-style.css";
import "../../styles/detail-style.css";

const InternshipDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const [siteMode, setSiteMode] = useState("watch");

  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [user, setUser] = useState();

  const [companyId, setCompanyId] = useState(null);

  const [item, setItem] = useState();

  const [internshipAlreadySet, setInternshiAlreadySet] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!internshipAlreadySet) {
      axios
        .get(
          `${process.env.REACT_APP_API_URL}/api/Internship/${props.match.params.id}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setItem(response.data);
          setCompanyId(response.data.companyId);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setInternshiAlreadySet(true);
        });
    }
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Company`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/CompanyAddress`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setAddresses(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setDefinitions(response.data);
      })
      .catch((error) => {
        setError(true);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        response.data.data.forEach((item1) => {
          if (item1.id === item.userId) {
            setUser(item1);
          }
        });
      })
      .catch((error) => {})
      .then(() => {
        setLoading(false);
      });
  }, [props.match.params.id, profile, item, internshipAlreadySet, accessToken]);
  function renderCompanies() {
    const array = companies.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return array;
  }
  function renderDefinitions() {
    const array = definitions.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return array;
  }
  function renderAddresses() {
    const array = addresses.map((item) => {
      if (parseInt(item.companyId) === parseInt(companyId)) {
        return (
          <option value={item.id} key={item.id}>
            {`${item.streetName} ${item.houseNumber} ${item.city} ${item.postalCode}`}
          </option>
        );
      } else {
        return null;
      }
    });
    return array;
  }
  const validate = (values) => {
    const errors = {};
    if (!values.CompanyRepresentative) {
      errors.CompanyRepresentative = "Nutné vyplnit kontaktní osobu!";
    }
    if (!values.CompaniesRepresentativeEmail) {
      errors.CompaniesRepresentativeEmail =
        "Nutné vyplnit e-mail kontaktní osoby!";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.CompaniesRepresentativeEmail
      )
    ) {
      errors.CompaniesRepresentativeEmail = "Nesprávný e-mail!";
    }
    if (!values.CompaniesRepresentativeTelephoneNumber) {
      errors.CompaniesRepresentativeTelephoneNumber =
        "Nutné vyplnit telefonní číslo kontaktní osoby!";
    }
    if (!values.CompanyContactPerson) {
      errors.CompanyContactPerson = "Nutné vyplnit zástupce firmy!";
    }
    if (!values.CompaniesContactPersonEmail) {
      errors.CompaniesContactPersonEmail =
        "Nutné vyplnit e-mail zástupce firmy!";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.CompaniesContactPersonEmail
      )
    ) {
      errors.CompaniesContactPersonEmail = "Nesprávný e-mail!";
    }
    if (!values.CompaniesContacPersonTelephoneNumber) {
      errors.CompaniesContacPersonTelephoneNumber =
        "Nutné vyplnit telefonní číslo zástupce firmy!";
    }
    if (!values.JobDescription) {
      errors.JobDescription = "Nutné vyplnit popis práce!";
    }
    if (!values.CompanyId) {
      errors.CompanyId = "Nutné vybrat adresu!";
    } else {
      setCompanyId(values.CompanyId);
    }
    if (!values.CompanyAddressId) {
      errors.CompanyAddressId = "Nutné vybrat firmu!";
    }
    if (!values.ProfessionalExperienceDefinitionId) {
      errors.ProfessionalExperienceDefinitionId = "Nutné vybrat definici!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      CompanyRepresentative:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companyRepresentative
          : "",
      CompaniesRepresentativeEmail:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companiesRepresentativeEmail
          : "",
      CompaniesRepresentativeTelephoneNumber:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companiesRepresentativeTelephoneNumber
          : "",
      CompanyContactPerson:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companyContactPerson
          : "",
      CompaniesContactPersonEmail:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companiesContactPersonEmail
          : "",
      CompaniesContacPersonTelephoneNumber:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companiesContacPersonTelephoneNumber
          : "",
      JobDescription:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.jobDescription
          : "",
      AdditionalInformations:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.additionalInformations
          : "",

      CompanyId:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companyId
          : "",
      CompanyAddressId:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.companyAddressId
          : "",
      ProfessionalExperienceDefinitionId:
        typeof props.location.state !== "undefined"
          ? props.location.state.item.professionalExperienceDefinitionId
          : "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/Internship/${item.id}`,
          {
            CompanyRepresentative: values.CompanyRepresentative,
            CompaniesRepresentativeEmail: values.CompaniesRepresentativeEmail,
            CompaniesRepresentativeTelephoneNumber:
              values.CompaniesRepresentativeTelephoneNumber,
            CompanyContactPerson: values.CompanyContactPerson,
            CompaniesContactPersonEmail: values.CompaniesContactPersonEmail,
            CompaniesContacPersonTelephoneNumber:
              values.CompaniesContacPersonTelephoneNumber,
            JobDescription: values.JobDescription,
            AdditionalInformations: values.AdditionalInformations,

            CompanyId: parseInt(values.CompanyId),
            CompanyAddressId: parseInt(values.CompanyAddressId),
            ProfessionalExperienceDefinitionId: parseInt(
              values.ProfessionalExperienceDefinitionId
            ),
            UserId: user.id,
            Aktivni: item.aktivni,
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
          //history.push("/internships");
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    },
  });

  if (accessToken && profile) {
    if (
      profile.hasOwnProperty("internship_administrator") |
      profile.hasOwnProperty("internship_student")
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
      } else if (item && user) {
        if (siteMode === "watch") {
          return (
            <Navbar profile={profile} active_item="Internships">
              <Container>
                <Row className="justify-content-center">
                  <Col sm="12" lg="7" md="12" className="text-center">
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
                                <h3>
                                  {item.id} (
                                  {`${user.firstName} ${user.lastName}`})
                                </h3>
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
                                md="3"
                                className="text-right"
                              >
                                <h3 style={{ color: "#A9A9A9" }}>Adresa</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>
                                  {`${item.companyAddress.streetName}
                            ${item.companyAddress.houseNumber},
                            ${item.companyAddress.postalCode}
                            ${item.companyAddress.city}`}
                                </h2>
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
                                  Definice praxe
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
                                  {item.professionalExperienceDefinition.name}
                                </h2>
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
                                <h2>{item.jobDescription}</h2>
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
                                <h3 style={{ color: "#A9A9A9" }}>Poznámky</h3>
                              </Col>
                              <Col
                                xs="8"
                                sm="8"
                                lg="9"
                                md="8"
                                className="text-left"
                              >
                                <h2>{item.additionalInformations}</h2>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Container>
                    </Jumbotron>
                  </Col>
                  <Col
                    sm="12"
                    lg="5"
                    md="12"
                    className="text-center"
                    style={{
                      wordWrap: "break-word",
                      paddingTop: "20px",
                    }}
                  >
                    <Row>
                      <Col sm="12" lg="12" md="12">
                        <Jumbotron
                          style={{
                            backgroundColor: "#383c44",
                            color: "white",
                            padding: "10px",
                          }}
                        >
                          <Row>
                            <Col
                              xs="12"
                              sm="12"
                              lg="12"
                              md="12"
                              className="text-center my-auto"
                            >
                              <h2>Zástupce firmy</h2>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="7"
                              md="8"
                              className="text-left"
                            >
                              <h3>{item.companyRepresentative}</h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h3>
                                <a
                                  href={`mailto:${item.companiesRepresentativeEmail}`}
                                >
                                  {item.companiesRepresentativeEmail}
                                </a>
                              </h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h3>
                                <a
                                  href={`tel:${item.companiesRepresentativeTelephoneNumber}`}
                                >
                                  {item.companiesRepresentativeTelephoneNumber}
                                </a>
                              </h3>
                            </Col>
                          </Row>
                        </Jumbotron>
                      </Col>
                      <Col sm="12" lg="12" md="12">
                        <Jumbotron
                          style={{
                            backgroundColor: "#383c44",
                            color: "white",
                            padding: "10px",
                          }}
                        >
                          <Row>
                            <Col
                              xs="12"
                              sm="12"
                              lg="12"
                              md="12"
                              className="text-center my-auto"
                            >
                              <h3>Kontaktní osoba</h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h3>{item.companyContactPerson}</h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h3>
                                <a
                                  href={`mailto:${item.companiesContactPersonEmail}`}
                                >
                                  {item.companiesContactPersonEmail}
                                </a>
                              </h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h3>
                                <a
                                  href={`tel:${item.companiesContacPersonTelephoneNumber}`}
                                >
                                  {item.companiesContacPersonTelephoneNumber}
                                </a>
                              </h3>
                            </Col>
                          </Row>
                        </Jumbotron>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="justify-content-center">
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
                          <Col sm="12" lg="12" md="12">
                            <Form onSubmit={formik.handleSubmit}>
                              <FormGroup>
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
                                    {renderCompanies()}
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
                                <FormGroup>
                                  <Label>Adresa firmy</Label>
                                  <Input
                                    name="CompanyAddressId"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.CompanyAddressId}
                                  >
                                    <option value="">Vybrat adresu...</option>
                                    {renderAddresses()}
                                  </Input>
                                  {formik.errors.CompanyAddressId &&
                                  formik.touched.CompanyAddressId ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.CompanyAddressId}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Definice</Label>
                                  <Input
                                    name="ProfessionalExperienceDefinitionId"
                                    type="select"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formik.values
                                        .ProfessionalExperienceDefinitionId
                                    }
                                  >
                                    <option value="">Vybrat definici...</option>
                                    {renderDefinitions()}
                                  </Input>
                                  {formik.errors
                                    .ProfessionalExperienceDefinitionId &&
                                  formik.touched
                                    .ProfessionalExperienceDefinitionId ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {
                                        formik.errors
                                          .ProfessionalExperienceDefinitionId
                                      }
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Kontaktní osoba</Label>
                                  <Input
                                    id="CompanyContactPerson"
                                    name="CompanyContactPerson"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.CompanyContactPerson}
                                  />
                                  {formik.errors.CompanyContactPerson &&
                                  formik.touched.CompanyContactPerson ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.CompanyContactPerson}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Telefonní číslo kontaktní osoby</Label>
                                  <Input
                                    id="CompaniesContacPersonTelephoneNumber"
                                    name="CompaniesContacPersonTelephoneNumber"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formik.values
                                        .CompaniesContacPersonTelephoneNumber
                                    }
                                  />
                                  {formik.errors
                                    .CompaniesContacPersonTelephoneNumber &&
                                  formik.touched
                                    .CompaniesContacPersonTelephoneNumber ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {
                                        formik.errors
                                          .CompaniesContacPersonTelephoneNumber
                                      }
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>E-mail kontaktní osoby</Label>
                                  <Input
                                    id="CompaniesContactPersonEmail"
                                    name="CompaniesContactPersonEmail"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formik.values.CompaniesContactPersonEmail
                                    }
                                  />
                                  {formik.errors.CompaniesContactPersonEmail &&
                                  formik.touched.CompaniesContactPersonEmail ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {
                                        formik.errors
                                          .CompaniesContactPersonEmail
                                      }
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Zástupce firmy</Label>
                                  <Input
                                    id="CompanyRepresentative"
                                    name="CompanyRepresentative"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.CompanyRepresentative}
                                  />
                                  {formik.errors.CompanyRepresentative &&
                                  formik.touched.CompanyRepresentative ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.CompanyRepresentative}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Telefonní číslo zástupce firmy</Label>
                                  <Input
                                    id="CompaniesRepresentativeTelephoneNumber"
                                    name="CompaniesRepresentativeTelephoneNumber"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formik.values
                                        .CompaniesRepresentativeTelephoneNumber
                                    }
                                  />
                                  {formik.errors
                                    .CompaniesRepresentativeTelephoneNumber &&
                                  formik.touched
                                    .CompaniesRepresentativeTelephoneNumber ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {
                                        formik.errors
                                          .CompaniesRepresentativeTelephoneNumber
                                      }
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>E-mail zástupce firmy</Label>
                                  <Input
                                    id="CompaniesRepresentativeEmail"
                                    name="CompaniesRepresentativeEmail"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={
                                      formik.values.CompaniesRepresentativeEmail
                                    }
                                  />
                                  {formik.errors.CompaniesRepresentativeEmail &&
                                  formik.touched
                                    .CompaniesRepresentativeEmail ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {
                                        formik.errors
                                          .CompaniesRepresentativeEmail
                                      }
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Popis práce</Label>
                                  <Input
                                    id="JobDescription"
                                    name="JobDescription"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.JobDescription}
                                  />
                                  {formik.errors.JobDescription &&
                                  formik.touched.JobDescription ? (
                                    <Alert
                                      style={{ marginTop: "10px" }}
                                      color="danger"
                                    >
                                      {formik.errors.JobDescription}
                                    </Alert>
                                  ) : null}
                                </FormGroup>
                                <FormGroup>
                                  <Label>Doplňující informace</Label>
                                  <Input
                                    id="AdditionalInformations"
                                    name="AdditionalInformations"
                                    type="textarea"
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
                              </FormGroup>
                              <Button
                                type="submit"
                                color="success"
                                variant="primary"
                              >
                                Uložit
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
        }
      } else {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Error />
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
export default InternshipDetail;
