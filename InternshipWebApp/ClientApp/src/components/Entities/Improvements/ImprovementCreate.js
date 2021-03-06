import React, { useState } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Error from "../../messages/Error.js";

import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

const ImprovementCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = (values) => {
    const errors = {};
    if (!values.nazev) {
      errors.nazev = "Nutné vyplnit název!";
    }
    if (!values.telo) {
      errors.telo = "Nutné vyplnit tělo!";
    }
  };
  const formik = useFormik({
    initialValues: {
      nazev: "",
      telo: "",
    },
    validate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Improvement`,
          {
            Head: values.nazev,
            Body: values.telo,
            Status: "Nezpracováno",
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          history.push("/improvements");
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
      return (
        <Navbar profile={profile} active_item="Improvements">
          <Error />
        </Navbar>
      );
    } else if (loading) {
      return (
        <Navbar profile={profile} active_item="Improvements">
          <Loading />
        </Navbar>
      );
    } else {
      return (
        <Navbar profile={profile} active_item="Improvements">
          <div className="container" style={{ color: "white" }}>
            <div className="row">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <Form onSubmit={formik.handleSubmit}>
                  <FormGroup>
                    <FormGroup>
                      <Label>Název</Label>
                      <Input
                        id="nazev"
                        name="nazev"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.nazev}
                        placeholder="Chyba s přihlášením"
                      />
                      {formik.errors.nazev && formik.touched.nazev ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.nazev}
                        </Alert>
                      ) : null}
                    </FormGroup>
                    <FormGroup>
                      <Label>Tělo</Label>
                      <Input
                        id="telo"
                        name="telo"
                        type="textarea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.telo}
                        placeholder="Když jsem se chtěl přihlásit, tak..."
                      />
                      {formik.errors.telo && formik.touched.telo ? (
                        <Alert style={{ marginTop: "10px" }} color="danger">
                          {formik.errors.telo}
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
              </div>
            </div>
          </div>
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
export default ImprovementCreate;
