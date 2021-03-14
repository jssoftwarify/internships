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
  FormGroup,
  Label,
  Input,
  Form,
  Alert,
  Container,
  Row,
  Col,
} from "reactstrap";

const ClassroomCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectListItems, setSelectListItems] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (accessToken) {
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
          setSelectListItems(response.data);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [accessToken]);

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
      nazev: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/classroom`,
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
          setError(false);
          history.push("/classrooms");
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
      } else if (selectListItems) {
        return (
          <Navbar profile={profile} active_item="Classrooms">
            <Container style={{ color: "white" }}>
              <Row>
                <Col sm="12" lg="12" md="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
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
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.nazev}
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
export default ClassroomCreate;
