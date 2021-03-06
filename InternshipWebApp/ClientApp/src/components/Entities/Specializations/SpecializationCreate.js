import React, { useState } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Unauthorized from "../../messages/Unauthorized.js";
import Error from "../../messages/Error.js";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Row,
  Container,
  Col,
} from "reactstrap";

const SpecializationCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.nazev) {
      errors.nazev = "Nutné vyplnit název!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      nazev: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Specialization`,
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
          history.push("/specializations");
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
          <Navbar profile={profile} active_item="Specializations">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Specializations">
            <Loading />
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Specializations">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="12" md="12" sm="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <Label>Název oboru</Label>
                      <Input
                        id="nazev"
                        name="nazev"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nazev}
                        placeholder="Strojírenství"
                      />
                      {formik.errors.nazev && formik.touched.nazev ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.nazev}
                        </Alert>
                      ) : null}
                    </FormGroup>
                    <Button
                      type="submit"
                      color="success"
                      variant="primary"
                      disabled={
                        !(formik.isValid && formik.dirty) || formik.isSubmitting
                      }
                    >
                      {!formik.isSubmitting ? "Uložit" : "Pracuji"}
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
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Specializations">
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
export default SpecializationCreate;
