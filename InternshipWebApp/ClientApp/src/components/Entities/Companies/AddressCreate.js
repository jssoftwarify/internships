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
  FormGroup,
  Label,
  Input,
  Alert,
  Container,
  Row,
  Col,
} from "reactstrap";

const AddressCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    setLoading(true);
    if (accessToken) {
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
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [accessToken]);
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
      StreetName: "",
      HouseNumber: "",
      City: "",
      PostalCode: "",
      Headquarter: false,
      CompanyId: "",
      Longtitude: 0,
      Latitude: 0,
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/CompanyAddress/`,
          {
            StreetName: values.StreetName,
            HouseNumber: values.HouseNumber,
            City: values.City,
            PostalCode: values.PostalCode,
            Headquarter: values.Headquarter,
            CompanyId: parseInt(values.CompanyId),
            Longtitude: values.Longtitude,
            Latitude: values.Latitude,
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          setError(false);
          profile.hasOwnProperty("internship_student")
            ? history.push("/home")
            : history.push("/companies");
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
      profile.hasOwnProperty("internship_student")
    ) {
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
      } else if (companies) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="12" md="12" sm="12">
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
                          placeholder="Vítězná"
                        />
                        {formik.errors.StreetName &&
                        formik.touched.StreetName ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
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
                          placeholder="56"
                        />
                        {formik.errors.HouseNumber &&
                        formik.touched.HouseNumber ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
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
                          placeholder="Liberec"
                        />
                        {formik.errors.City && formik.touched.City ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
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
                          checked={formik.values.PostalCode}
                          placeholder="46001"
                        />
                        {formik.errors.PostalCode &&
                        formik.touched.PostalCode ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.PostalCode}
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
                          {renderCompanies()}
                        </Input>
                        {formik.errors.CompanyId && formik.touched.CompanyId ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.CompanyId}
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
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.Latitude && formik.touched.Latitude ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
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
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                        {formik.errors.Longtitude &&
                        formik.touched.Longtitude ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.Longtitude}
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
                            value={formik.values.Headquater}
                          />
                          {formik.errors.Headquater &&
                          formik.touched.Headquater ? (
                            <Alert style={{ marginTop: "10px" }} color="danger">
                              {formik.errors.Headquater}
                            </Alert>
                          ) : null}
                          Hlavní sídlo firmy
                        </Label>
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
export default AddressCreate;
