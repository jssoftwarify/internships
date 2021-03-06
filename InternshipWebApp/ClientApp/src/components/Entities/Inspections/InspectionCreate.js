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

const InspectionCreate = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.AdditionalInformations) {
      errors.AdditionalInformations = "Nutné vyplnit!";
    }
    if (values.InspectionRating === "") {
      errors.InspectionRating = "Nunté vybrat hodnocení";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      AdditionalInformations: "",
      InspectionRating: 0,
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);

      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/inspection`,
          {
            InspectionDate: new Date(),
            InspectionRating: parseInt(values.InspectionRating),
            AdditionalInformations: values.AdditionalInformations,
            InternshipId: parseInt(props.match.params.id),
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          history.push("/internships");
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
    if (profile.hasOwnProperty("internship_controller")) {
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
      } else {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Container style={{ color: "white" }}>
              <Row>
                <Col sm="12" lg="12" md="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <FormGroup>
                        <Label>Informace o praxi</Label>
                        <Input
                          id="AdditionalInformations"
                          name="AdditionalInformations"
                          type="textarea"
                          placeholder="Student vykonával úspěšně..."
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.AdditionalInformations}
                        />
                        {formik.errors.AdditionalInformations &&
                        formik.touched.AdditionalInformations ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.AdditionalInformations}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Hodnocení</Label>
                        <Input
                          id="InspectionRating"
                          name="InspectionRating"
                          type="select"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.InspectionRating}
                        >
                          <option value="">Vybrat hodnocení...</option>
                          <option value={0}>Výborný</option>
                          <option value={1}>Chvalitebný</option>
                          <option value={2}>Dobrý</option>
                          <option value={3}>Dostačující</option>
                          <option value={4}>Nedostačující</option>
                        </Input>
                        {formik.errors.InspectionRating &&
                        formik.touched.InspectionRating ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.InspectionRating}
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
export default InspectionCreate;
