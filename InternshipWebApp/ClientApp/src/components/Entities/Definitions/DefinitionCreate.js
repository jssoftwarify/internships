import React, { useState, useEffect } from "react";
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

const DefinitionCreate = () => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectListItems, setSelectListItems] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Classroom`, {
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
  }, []);
  const validate = (values) => {
    const errors = {};
    if (!values.nazev) {
      errors.nazev = "Nutné vyplnit název!";
    }
    if (!values.zacatek) {
      errors.zacatek = "Nutné vyplnit začátek praxe!";
    }
    if (!values.konec) {
      errors.konec = "Nutné vyplnit konec praxe!";
    }
    if (!values.rok) {
      errors.rok = "Nutné vyplnit rok!";
    }
    if (!values.dny) {
      errors.dny = "Nutné vyplnit počet dní!";
    }
    if (!values.hodiny) {
      errors.hodiny = "Nutné vyplnit počet hodin!";
    }

    if (!values.ClassroomIds) {
      errors.ClassroomIds = "Nutné vybrat třídu!";
    }
    if (!values.representative) {
      errors.representative = "Nutné vyplnit jméno zástupce!";
    }
    if (!values.representativeEmail) {
      errors.representativeEmail = "Nutné vyplnit e-mail zástupce firmy!";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
        values.representativeEmail
      )
    ) {
      errors.representativeEmail = "Nesprávný e-mail!";
    }

    if (!values.representativeNumber) {
      errors.representativeNumber = "Nutné vyplnit telefonní číslo zástupce!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      nazev: "",
      zacatek: "",
      konec: "",
      rok: "",
      dny: "",
      hodiny: "",
      //classroom: "",
      active: false,
      longtime: false,
      ClassroomIds: [],
      representative: "",
      representativeEmail: "",
      representativeNumber: "",
    },
    validate,
    onSubmit: async (values) => {
      const idArray = values.ClassroomIds.map((item) => parseInt(item));
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/professionalExperienceDefinition`,
          {
            Name: values.nazev,
            Start: values.zacatek,
            End: values.konec,
            Year: values.rok,
            NumberOfDays: values.dny,
            NumberOfHours: values.hodiny,
            Active: values.active,
            Longtime: values.longtime,
            ClassroomIds: idArray,
            DefinitionRepresentative: values.representative,
            DefinitionRepresentativeEmail: values.representativeEmail,
            DefinitionRepresentativeTelephoneNumber:
              values.representativeNumber,
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          history.push("/definitions");
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    },
  });
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

  if (accessToken) {
    if (profile.hasOwnProperty("internship_administrator")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Definitions">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Definitions">
            <Loading />
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Definitions">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="12" md="12" sm="12">
                  <Form onSubmit={formik.handleSubmit}>
                    <FormGroup>
                      <FormGroup>
                        <Label>Název definice</Label>
                        <Input
                          id="nazev"
                          name="nazev"
                          type="text"
                          placeholder="Čtvrtý ročník"
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
                      <FormGroup>
                        <Label>Začátek praxe</Label>
                        <Input
                          id="zacatek"
                          name="zacatek"
                          type="date"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.zacatek}
                        />
                        {formik.errors.zacatek && formik.touched.zacatek ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.zacatek}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Koknec praxe</Label>
                        <Input
                          id="konec"
                          name="konec"
                          type="date"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.konec}
                        />
                        {formik.errors.konec && formik.touched.konec ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.konec}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Rok</Label>
                        <Input
                          id="rok"
                          name="rok"
                          type="number"
                          placeholder="2020"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.rok}
                        />
                        {formik.errors.rok && formik.touched.rok ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.rok}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Počet dní</Label>
                        <Input
                          id="dny"
                          name="dny"
                          type="number"
                          placeholder="10"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.dny}
                        />
                        {formik.errors.dny && formik.touched.dny ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.dny}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Počet hodin</Label>
                        <Input
                          id="hodiny"
                          name="hodiny"
                          type="number"
                          placeholder="45"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.hodiny}
                        />
                        {formik.errors.hodiny && formik.touched.hodiny ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.hodiny}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Třída</Label>
                        <Input
                          name="ClassroomIds"
                          type="select"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.ClassroomIds}
                          multiple
                        >
                          <option value="">Vybrat třídu...</option>
                          {renderSelectListItems()}
                        </Input>
                        {formik.errors.ClassroomIds &&
                        formik.touched.ClassroomIds ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.ClassroomIds}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Jméno zástupce</Label>
                        <Input
                          id="representative"
                          name="representative"
                          type="text"
                          placeholder="Radek Havlík"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.representative}
                        />
                        {formik.errors.representative &&
                        formik.touched.representative ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.representative}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Email zástupce</Label>
                        <Input
                          id="representativeEmail"
                          name="representativeEmail"
                          type="text"
                          placeholder="radek.havlik@pslib.cz"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.representativeEmail}
                        />
                        {formik.errors.representativeEmail &&
                        formik.touched.representativeEmail ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.representativeEmail}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <FormGroup>
                        <Label>Telefonní číslo zástupce</Label>
                        <Input
                          id="representativeNumber"
                          name="representativeNumber"
                          type="text"
                          placeholder="+420 485 100 113"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.representativeNumber}
                        />
                        {formik.errors.representativeNumber &&
                        formik.touched.representativeNumber ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {formik.errors.representativeNumber}
                          </Alert>
                        ) : null}
                      </FormGroup>
                      <Row>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                id="active"
                                name="active"
                                type="checkbox"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.active}
                              />
                              {formik.errors.active && formik.touched.active ? (
                                <Alert
                                  style={{ marginTop: "10px" }}
                                  color="danger"
                                >
                                  {formik.errors.active}
                                </Alert>
                              ) : null}
                              Aktivní
                            </Label>
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormGroup check>
                            <Label check>
                              <Input
                                id="longtime"
                                name="longtime"
                                type="checkbox"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                checked={formik.values.longtime}
                              />
                              {formik.errors.longtime &&
                              formik.touched.longtime ? (
                                <Alert
                                  style={{ marginTop: "10px" }}
                                  color="danger"
                                >
                                  {formik.errors.longtime}
                                </Alert>
                              ) : null}
                              Dlouhodobá
                            </Label>
                          </FormGroup>
                        </Col>
                      </Row>
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
        <Navbar profile={profile} active_item="Definitions">
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
export default DefinitionCreate;
