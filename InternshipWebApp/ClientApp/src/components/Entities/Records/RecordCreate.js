import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Unauthorized from "../../messages/Unauthorized.js";
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

const RecordCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [internship, setInternship] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`)
      .then((response) => {
        response.data.data.forEach((item) => {
          if (item.email === profile.email) {
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/Users/${item.id}`)
              .then((response) => {})
              .catch((error) => {
                setError(true);
              });
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/internship`)
              .then((response) => {
                response.data.forEach((item2) => {
                  if ((item2.userId === item.id) & (item2.aktivni === true)) {
                    setInternship(item2);
                  }
                });
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

  const validate = (values) => {
    const errors = {};
    if (!values.hours) {
      errors.hours = "Nutné vyplnit počet hodin!";
    }
    if (!values.description) {
      errors.description = "Nutné vyplnit popis práce!";
    }
    if (!values.date) {
      errors.date = "Nutné vyplnit datum!";
    }
    var date_regex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/;
    if (!date_regex.test(values.date)) {
      errors.date = "Nutné zadat datum ve spávném formátu";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      hours: "",
      description: "",
      date: new Date().toISOString().substr(0, 10),
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Record`,
          {
            NumberOfHours: values.hours.toString(),
            WorkDescription: values.description,
            DateOfRecord: values.date,
            InternshipId: parseInt(internship.id),
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          history.push("/records");
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
    if (profile.hasOwnProperty("internship_student")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Denik">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Classrooms">
            <Loading />
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Denik">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="12" md="12" sm="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <FormGroup>
                        <Label>Počet hodin</Label>
                        <Input
                          id="hours"
                          name="hours"
                          type="number"
                          placeholder="7"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.hours}
                        />
                        
                      </FormGroup>
                      <FormGroup>
                        <Label>Datum záznamu</Label>
                        <Input
                          id="date"
                          name="date"
                          type="date"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.date}
                        />
                        {formik.errors.date && formik.touched.date ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.date}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Popis práce</Label>
                        <Input
                          id="description"
                          name="description"
                          type="textarea"
                          placeholder="Práce na webové aplikaci"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.description}
                        />
                        {formik.errors.description &&
                        formik.touched.description ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.description}
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
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Denik">
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
export default RecordCreate;
