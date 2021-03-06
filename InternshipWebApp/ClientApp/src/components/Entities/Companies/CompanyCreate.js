import React, { useState } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Unauthorized from "../../messages/Unauthorized.js";
import Error from "../../messages/Error.js";
import Loading from "../../Pages/Loading.js";

import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Container,
  Col,
  Row,
} from "reactstrap";

const CompanyCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const validate = (values) => {
    const errors = {};
    if (!values.ico) {
      errors.ico = "Nutné vyplnit IČO!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      ico: 0,
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/Company/${values.ico}`, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        })
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
      } else {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="12" md="12" sm="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <Label>IČO firmy</Label>
                      <Input
                        id="ico"
                        name="ico"
                        type="number"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.ico}
                        placeholder="00029947"
                      />
                      {formik.errors.ico && formik.touched.ico ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.ico}
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
export default CompanyCreate;
