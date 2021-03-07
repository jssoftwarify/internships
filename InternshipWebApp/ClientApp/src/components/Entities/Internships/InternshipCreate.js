import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading.js";
import Error from "../../messages/Error.js";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Container,
  Row,
  Col,
} from "reactstrap";

const SpecializationCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [user, setUser] = useState();
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Company`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/CompanyAddress`)
      .then((response) => {
        setAddresses(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition`
      )
      .then((response) => {
        setDefinitions(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`)
      .then((response) => {
        response.data.data.forEach((item) => {
          if (item.email === profile.email) {
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/Users/${item.id}`)
              .then((response) => {
                setUser(response.data);
              })
              .catch((error) => {
                setError(true);
              });
          }
        });
      })
      .catch((error) => {})
      .then(() => {
        setLoading(false);
      });
  }, [profile]);
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
            {`${item.streetName} ${item.houseNumber} ${item.city}, ${item.postalCode}`}
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
      CompanyRepresentative: "",
      CompaniesRepresentativeEmail: "",
      CompaniesRepresentativeTelephoneNumber: "",
      CompanyContactPerson: "",
      CompaniesContactPersonEmail: "",
      CompaniesContacPersonTelephoneNumber: "",
      JobDescription: "",
      AdditionalInformations: "",

      CompanyId: "",
      CompanyAddressId: "",
      ProfessionalExperienceDefinitionId: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Internship/createInternship/${user.id}`,
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
          },

          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (profile.hasOwnProperty("internship_administrator")) {
            history.push("/internships");
          } else {
            history.push("/home");
          }
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
    if (error) {
      return <Error />;
    } else if (loading) {
      return <Loading />;
    } else if (addresses && companies && definitions && user) {
      return (
        <Navbar profile={profile} active_item="Internships">
          <Container className="container" style={{ color: "white" }}>
            <Row className="row">
              <Col lg="12" md="12" sm="12">
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
                      {formik.errors.CompanyId && formik.touched.CompanyId ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
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
                        <Alert style={{ marginTop: "10px" }} color="danger">
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
                        value={formik.values.ProfessionalExperienceDefinitionId}
                      >
                        <option value="">Vybrat definici...</option>
                        {renderDefinitions()}
                      </Input>
                      {formik.errors.ProfessionalExperienceDefinitionId &&
                      formik.touched.ProfessionalExperienceDefinitionId ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.ProfessionalExperienceDefinitionId}
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
                        placeholder="Ondřej Pomikálek"
                      />
                      {formik.errors.CompanyContactPerson &&
                      formik.touched.CompanyContactPerson ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
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
                          formik.values.CompaniesContacPersonTelephoneNumber
                        }
                        placeholder="+420 666 784 754"
                      />
                      {formik.errors.CompaniesContacPersonTelephoneNumber &&
                      formik.touched.CompaniesContacPersonTelephoneNumber ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.CompaniesContacPersonTelephoneNumber}
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
                        value={formik.values.CompaniesContactPersonEmail}
                        placeholder="o.pomikalek@seznam.cz"
                      />
                      {formik.errors.CompaniesContactPersonEmail &&
                      formik.touched.CompaniesContactPersonEmail ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.CompaniesContactPersonEmail}
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
                        placeholder="Radek Trněný"
                      />
                      {formik.errors.CompanyRepresentative &&
                      formik.touched.CompanyRepresentative ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
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
                          formik.values.CompaniesRepresentativeTelephoneNumber
                        }
                        placeholder="+420 721 785 145"
                      />
                      {formik.errors.CompaniesRepresentativeTelephoneNumber &&
                      formik.touched.CompaniesRepresentativeTelephoneNumber ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.CompaniesRepresentativeTelephoneNumber}
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
                        value={formik.values.CompaniesRepresentativeEmail}
                        placeholder="r.trneny@mail.cz"
                      />
                      {formik.errors.CompaniesRepresentativeEmail &&
                      formik.touched.CompaniesRepresentativeEmail ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.CompaniesRepresentativeEmail}
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
                        placeholder="vývoj softwaru"
                      />
                      {formik.errors.JobDescription &&
                      formik.touched.JobDescription ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
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
                        placeholder="Budu pracovat ve skupině"
                      />
                      {formik.errors.AdditionalInformations &&
                      formik.touched.AdditionalInformations ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.AdditionalInformations}
                        </Alert>
                      ) : null}
                    </FormGroup>
                  </FormGroup>
                  <Button type="submit" color="success" variant="primary">
                    Vytvořit
                  </Button>
                  <Button
                    color="danger"
                    onClick={() => {
                      history.goBack();
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
    } else {
      return <Loading />;
    }
  } else {
    return (
      <MessageLayout>
        <Login />
      </MessageLayout>
    );
  }
};
export default SpecializationCreate;
