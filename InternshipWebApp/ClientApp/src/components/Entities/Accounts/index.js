import React, { useEffect, useState } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useFormik } from "formik";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Error from "../../messages/Error.js";

import "../../styles/mobile-size-hidden-icons.css";

import {
  Container,
  Row,
  Col,
  Alert,
  Form,
  Input,
  Button,
  Collapse,
  FormGroup,
  Label,
} from "reactstrap";

import {
  faUser,
  faEnvelope,
  faVenusMars,
  faUserCircle,
  faAngleRight,
  faAngleDown,
  faPhone,
  faMapMarkerAlt,
  faStarOfLife,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as ClassroomIcon } from "../../../assets/classroomIcon.svg";
import { ReactComponent as SpecializationIcon } from "../../../assets/specialization.svg";

import "../../styles/navbar-style.css";

const Accounts = (props) => {
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();
  const [classrooms, setClassrooms] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  const [telephoneFormik, setTelephoneFormik] = useState(false);
  const [dateFormikSwitch, setDateFormikSwitch] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [openAddresFormik, setOpenAddressFormik] = useState(false);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setLoading(true);
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
      .catch((error) => {});

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Classroom`)
      .then((response) => {
        setClassrooms(response.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Specialization`)
      .then((response) => {
        setSpecializations(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [profile, accessToken]);

  const validate = (values) => {
    const errors = {};

    if (!values.classroomId) {
      errors.classroomId = "Nutné vyplnit!";
    }

    if (!values.specializationId) {
      errors.specializationId = "Nutné vybrat definici";
    }

    return errors;
  };
  const formik = useFormik({
    initialValues: {
      classroomId: "",

      specializationId: "",
    },
    validate,
    onSubmit: async (values) => {
      console.log("první formik");
      setLoading(true);
      axios
        .put(
          `${process.env.REACT_APP_API_URL}/api/Users/${user.id}`,
          {
            FirstName: user.firstName,
            LastName: user.lastName,
            Gender: user.gender,
            Email: user.email,
            ClassroomId: parseInt(values.classroomId),
            SpecializationId: parseInt(values.specializationId),
            AddressId: user.addressId,
            BirthDate: user.birthDate,
            TelephoneNumber: user.telephoneNumber,
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )

        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        });
    },
  });
  const validateTelephoneNumber = (values) => {
    const errors = {};
    if (!values.number) {
      errors.number = "Zadejte telefonní čísla!";
    }
    return errors;
  };
  const telephoneNumberFormik = useFormik({
    initialValues: {
      number: "",
    },
    validateTelephoneNumber,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Users/setTelephone/${user.id}/${values.number}`,

          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )

        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        });
    },
  });
  const validateDate = (values) => {
    const errors = {};
    if (!values.date) {
      errors.date = "Zadejte datum!";
    }
    return errors;
  };
  const dateFormik = useFormik({
    initialValues: {
      date: "",
    },
    validateDate,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Users/setBirthDate/${user.id}/${values.date}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )

        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        });
    },
  });

  const validateAddress = (values) => {
    const errors = {};
    if (!values.streetName) {
      errors.streetName = "Prosím vyplňte číslo ulice!";
    }
    if (!values.houseNumber) {
      errors.houseNumber = "Prosím vyplňte číslo popisné!";
    }
    if (!values.city) {
      errors.city = "Prosím vyplňte město!";
    }
    if (!values.postalCode) {
      errors.postalCode = "Prosím vyplňte PSČ!";
    }
    return errors;
  };

  const addressFormik = useFormik({
    initialValues: {
      streetName: "",
      houseNumber: "",
      city: "",
      postalCode: "",
    },
    validateAddress,
    onSubmit: async (values) => {
      setLoading(true);
      axios
        .post(
          `${process.env.REACT_APP_API_URL}/api/Users/setUserAddress/${user.id}`,
          {
            StreetName: values.streetName,
            HouseNumber: values.houseNumber,
            City: values.city,
            PostalCode: values.postalCode,
            UserId: parseInt(user.id),
          },
          {
            headers: {
              Authorization: "Bearer " + accessToken,
              "Content-Type": "application/json",
            },
          }
        )

        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
          window.location.reload();
        });
    },
  });

  function renderClassrooms() {
    const array = classrooms.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return array;
  }
  function renderSpecializations() {
    const array = specializations.map((item) => {
      return (
        <option value={item.id} key={item.id}>
          {item.name}
        </option>
      );
    });
    return array;
  }
  const renderDate = (date) => {
    date = new Date(date);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    var datum = day + "." + month + "." + year;
    var nullYear = 1;
    if (year === nullYear) {
      return null;
    }
    return datum;
  };
  if (accessToken) {
    if (error) {
      return (
        <Navbar profile={profile} active_item="Accounts">
          <Error />
        </Navbar>
      );
    } else if (loading) {
      return (
        <Navbar profile={profile} active_item="Accounts">
          <Loading />
        </Navbar>
      );
    } else if (user) {
      /*{user.classroomId != null ||
            profile.hasOwnProperty("internship_administrator") ||
            profile.hasOwnProperty("internship_controller") ? (
              ""
            ) : (
              <Alert color="danger">Nejsi přiřazen do žádné třídy</Alert>
            )}
            {user.specializationId != null ||
            profile.hasOwnProperty("internship_administrator") ||
            profile.hasOwnProperty("internship_controller") ? (
              ""
            ) : (
              <Alert color="danger">Nemáš přiřazený žádný obor</Alert>
            )}*/
      return (
        <Navbar profile={profile} active_item="Accounts">
          <Container style={{ color: "white" }}>
            <Row>
              <Col sm="12" lg="4" md="4" className="header-icon">
                <FontAwesomeIcon
                  icon={faUser}
                  size="6x"
                  color="#ffffff"
                  style={{ padding: 5 }}
                ></FontAwesomeIcon>
              </Col>
              <Col sm="12" lg="8" md="8" className="header-text">
                <h3 className="display-3">
                  {`${profile.given_name} ${profile.family_name}`}
                </h3>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm="12" lg="12" md="12" className="text-center">
                <p className="lead" style={{ color: "#A9A9A9" }}>
                  Vaše role
                </p>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col sm="12" lg="12" md="12" className="text-center">
                <h3 className="display-6">
                  {profile.hasOwnProperty("internship_administrator")
                    ? "Administrátor"
                    : profile.hasOwnProperty("internship_controller")
                    ? "Kontrolér"
                    : profile.hasOwnProperty("internship_student")
                    ? "student"
                    : "Nedefinované"}
                </h3>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col sm="12" lg="12" md="12" className="text-center">
                <p className="lead" style={{ color: "#A9A9A9" }}>
                  Osobní údaje
                </p>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  size="3x"
                  color="#ffffff"
                  style={{ padding: 5 }}
                ></FontAwesomeIcon>
              </Col>
              <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                <h3 className="display-6">{profile.preferred_username}</h3>
              </Col>
            </Row>
            <Row className="align-items-center">
              <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  size="3x"
                  color="#ffffff"
                  style={{ padding: 5 }}
                ></FontAwesomeIcon>
              </Col>
              <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                <h3 className="display-6">{profile.email}</h3>
              </Col>
            </Row>

            {profile.hasOwnProperty("internship_student") ? (
              <>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <FontAwesomeIcon
                      icon={faVenusMars}
                      size="3x"
                      color="#ffffff"
                      style={{ padding: 5 }}
                    ></FontAwesomeIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    <h3 className="display-6">{profile.gender}</h3>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <FontAwesomeIcon
                      icon={faPhone}
                      size="3x"
                      color="#ffffff"
                      style={{ padding: 5 }}
                    ></FontAwesomeIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    {telephoneFormik ? (
                      <Form
                        onSubmit={telephoneNumberFormik.handleSubmit}
                        inline
                      >
                        <Input
                          type="text"
                          name="number"
                          id="number"
                          onChange={telephoneNumberFormik.handleChange}
                          onBlur={telephoneNumberFormik.handleBlur}
                          value={telephoneNumberFormik.values.number}
                        />
                        {telephoneNumberFormik.errors.number &&
                        telephoneNumberFormik.touched.number ? (
                          <Alert style={{ marginTop: "10px" }} color="danger">
                            {telephoneNumberFormik.errors.number}
                          </Alert>
                        ) : null}
                        <Button
                          color="success"
                          style={{ marginLeft: 3 }}
                          type="submit"
                        >
                          Uložit
                        </Button>
                      </Form>
                    ) : (
                      <h3 className="display-6">
                        {user.telephoneNumber ? (
                          <>
                            {user.telephoneNumber}
                            <button
                              className="icon-parent1"
                              style={{
                                outline: "none",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPen}
                                className="icon"
                                size="1x"
                                color="#A9A9A9"
                                style={{ padding: 2 }}
                                onClick={() =>
                                  setTelephoneFormik(!telephoneFormik)
                                }
                              ></FontAwesomeIcon>
                            </button>
                          </>
                        ) : (
                          <Row>
                            <Col style={{ paddingRight: 2 }}>
                              <Alert color="danger">Nevyplněno</Alert>
                            </Col>
                            <Col
                              className="text-left"
                              style={{ paddingLeft: 2, marginTop: 10 }}
                            >
                              <button
                                className="icon-parent1"
                                style={{
                                  outline: "none",
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="icon"
                                  size="1x"
                                  color="#A9A9A9"
                                  style={{ padding: 2 }}
                                  onClick={() =>
                                    setTelephoneFormik(!telephoneFormik)
                                  }
                                ></FontAwesomeIcon>
                              </button>
                            </Col>
                          </Row>
                        )}
                      </h3>
                    )}
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      size="3x"
                      color="#ffffff"
                      style={{ paddingRight: "10px" }}
                    ></FontAwesomeIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    <h3 className="display-6">
                      {user.address ? (
                        <>
                          {`${user.address.streetName} ${user.address.houseNumber}, ${user.address.postalCode}, ${user.address.city}`}
                          <button
                            className="icon-parent1"
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faPen}
                              className="icon"
                              size="1x"
                              color="#A9A9A9"
                              style={{ padding: 2 }}
                              onClick={() =>
                                setOpenAddressFormik(!openAddresFormik)
                              }
                            ></FontAwesomeIcon>
                          </button>
                        </>
                      ) : (
                        <Row>
                          <Col style={{ paddingRight: 2 }}>
                            <Alert color="danger">Nevyplněno</Alert>
                          </Col>
                          <Col
                            className="text-left"
                            style={{ paddingLeft: 2, marginTop: 10 }}
                          >
                            <button
                              className="icon-parent1"
                              style={{
                                outline: "none",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPen}
                                className="icon"
                                size="1x"
                                color="#A9A9A9"
                                style={{ padding: 2 }}
                                onClick={() =>
                                  setOpenAddressFormik(!openAddresFormik)
                                }
                              ></FontAwesomeIcon>
                            </button>
                          </Col>
                        </Row>
                      )}
                    </h3>
                    <Collapse isOpen={openAddresFormik}>
                      <Form onSubmit={addressFormik.handleSubmit}>
                        <FormGroup>
                          <FormGroup>
                            <Label>Ulice</Label>
                            <Input
                              name="streetName"
                              id="streetName"
                              type="text"
                              onChange={addressFormik.handleChange}
                              onBlur={addressFormik.handleBlur}
                              value={addressFormik.values.streetName}
                            />
                            {addressFormik.errors.streetName &&
                            addressFormik.touched.streetName ? (
                              <Alert
                                style={{ marginTop: "10px" }}
                                color="danger"
                              >
                                {addressFormik.errors.streetName}
                              </Alert>
                            ) : null}
                          </FormGroup>
                          <FormGroup>
                            <Label>Číslo popisné</Label>
                            <Input
                              name="houseNumber"
                              id="houseNumber"
                              type="text"
                              onChange={addressFormik.handleChange}
                              onBlur={addressFormik.handleBlur}
                              value={addressFormik.values.houseNumber}
                            />
                            {addressFormik.errors.houseNumber &&
                            addressFormik.touched.houseNumber ? (
                              <Alert
                                style={{ marginTop: "10px" }}
                                color="danger"
                              >
                                {addressFormik.errors.houseNumber}
                              </Alert>
                            ) : null}
                          </FormGroup>
                          <FormGroup>
                            <Label>Město</Label>
                            <Input
                              name="city"
                              id="city"
                              type="text"
                              onChange={addressFormik.handleChange}
                              onBlur={addressFormik.handleBlur}
                              value={addressFormik.values.city}
                            />
                            {addressFormik.errors.city &&
                            addressFormik.touched.city ? (
                              <Alert
                                style={{ marginTop: "10px" }}
                                color="danger"
                              >
                                {addressFormik.errors.city}
                              </Alert>
                            ) : null}
                          </FormGroup>
                          <FormGroup>
                            <Label>PSČ</Label>
                            <Input
                              name="postalCode"
                              id="postalCode"
                              type="text"
                              onChange={addressFormik.handleChange}
                              onBlur={addressFormik.handleBlur}
                              value={addressFormik.values.postalCode}
                            />
                            {addressFormik.errors.postalCode &&
                            addressFormik.touched.postalCode ? (
                              <Alert
                                style={{ marginTop: "10px" }}
                                color="danger"
                              >
                                {addressFormik.errors.postalCode}
                              </Alert>
                            ) : null}
                          </FormGroup>
                        </FormGroup>

                        <Button
                          color="success"
                          style={{ marginLeft: 3 }}
                          type="submit"
                        >
                          Uložit
                        </Button>
                      </Form>
                    </Collapse>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <FontAwesomeIcon
                      icon={faStarOfLife}
                      size="2x"
                      color="#ffffff"
                      style={{ marginRight: "6px" }}
                    ></FontAwesomeIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    {dateFormikSwitch ? (
                      <Form onSubmit={dateFormik.handleSubmit} inline>
                        <Input
                          name="date"
                          id="date"
                          type="date"
                          onChange={dateFormik.handleChange}
                          onBlur={dateFormik.handleBlur}
                          value={dateFormik.values.date}
                        />
                        <Button
                          color="success"
                          style={{ marginLeft: 3 }}
                          type="submit"
                        >
                          Uložit
                        </Button>
                      </Form>
                    ) : (
                      <h3 className="display-6">
                        {renderDate(user.birthDate) ? (
                          <>
                            {renderDate(user.birthDate)}
                            <button
                              className="icon-parent1"
                              style={{
                                outline: "none",
                                border: "none",
                                backgroundColor: "transparent",
                              }}
                            >
                              <FontAwesomeIcon
                                icon={faPen}
                                className="icon"
                                size="1x"
                                color="#A9A9A9"
                                style={{ padding: 2 }}
                                onClick={() =>
                                  setDateFormikSwitch(!dateFormikSwitch)
                                }
                              ></FontAwesomeIcon>
                            </button>
                          </>
                        ) : (
                          <Row>
                            <Col style={{ paddingRight: 2 }}>
                              <Alert color="danger">Nevyplněno</Alert>
                            </Col>
                            <Col
                              className="text-left"
                              style={{ paddingLeft: 2, marginTop: 10 }}
                            >
                              <button
                                className="icon-parent1"
                                style={{
                                  outline: "none",
                                  border: "none",
                                  backgroundColor: "transparent",
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPen}
                                  className="icon"
                                  size="1x"
                                  color="#A9A9A9"
                                  style={{ padding: 2 }}
                                  onClick={() =>
                                    setDateFormikSwitch(!dateFormikSwitch)
                                  }
                                ></FontAwesomeIcon>
                              </button>
                            </Col>
                          </Row>
                        )}
                      </h3>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" lg="12" md="12" className="text-center">
                    <p
                      className="lead"
                      style={{ color: "#A9A9A9", marginTop: "10px" }}
                    >
                      Školní údaje
                    </p>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <ClassroomIcon
                      fill="white"
                      style={{
                        color: "white",
                        height: "35px",
                        width: "auto",
                        padding: 5,
                      }}
                    ></ClassroomIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    <h3 className="display-6">
                      {user.classroom != null ? (
                        user.classroom.name
                      ) : (
                        <Alert color="danger">Nevyplněno</Alert>
                      )}
                    </h3>
                  </Col>
                </Row>
                <Row className="align-items-center">
                  <Col xs="2" sm="2" lg="4" md="4" className="text-right">
                    <SpecializationIcon
                      fill="white"
                      style={{
                        color: "white",
                        height: "35px",
                        width: "auto",
                        padding: 5,
                      }}
                    ></SpecializationIcon>
                  </Col>
                  <Col xs="10" sm="10" lg="8" md="8" className="text-left">
                    <h3 className="display-6">
                      {user.specialization != null ? (
                        user.specialization.name
                      ) : (
                        <Alert color="danger">Nevyplněno</Alert>
                      )}
                    </h3>
                  </Col>
                </Row>
                <hr />
                <Row className="justify-content-center" style={{ padding: 5 }}>
                  <Col sm="12" lg="12" md="12" className="text-center">
                    <p
                      className="lead"
                      style={{ color: "#A9A9A9" }}
                      onClick={() => toggle()}
                    >
                      Nastavení{" "}
                      {isOpen ? (
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          size="2x"
                          color="#A9A9A9"
                          style={{ height: "20px" }}
                        ></FontAwesomeIcon>
                      ) : (
                        <FontAwesomeIcon
                          icon={faAngleRight}
                          size="2x"
                          color="#A9A9A9"
                          style={{ height: "20px" }}
                        ></FontAwesomeIcon>
                      )}
                    </p>
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Collapse isOpen={isOpen}>
                    <Form onSubmit={formik.handleSubmit} inline>
                      <Col
                        sm="6"
                        lg="1"
                        md="1"
                        className="text-right hidden-icons"
                      >
                        <ClassroomIcon
                          fill="white"
                          style={{
                            color: "white",
                            height: "35px",
                            width: "auto",
                          }}
                        ></ClassroomIcon>
                      </Col>
                      <Col sm="6" lg="3" md="3" className="text-left">
                        <Input
                          type="select"
                          name="classroomId"
                          id="classroomId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.classroomId}
                          className="select-box-shift"
                        >
                          <option value="">Vyberte třídu...</option>
                          {renderClassrooms()}
                        </Input>
                      </Col>
                      <Col
                        sm="6"
                        lg="1"
                        md="1"
                        className="text-right hidden-icons"
                      >
                        <SpecializationIcon
                          fill="white"
                          style={{
                            color: "white",
                            height: "35px",
                            width: "auto",
                          }}
                        ></SpecializationIcon>
                      </Col>
                      <Col sm="6" lg="3" md="3" className="text-left">
                        <Input
                          type="select"
                          name="specializationId"
                          id="specializationId"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.specializationId}
                          className="select-box-shift"
                        >
                          <option value="">Vyberte obor...</option>
                          {renderSpecializations()}
                        </Input>
                      </Col>
                      <Col sm="12" lg="4" md="4" className="text-center">
                        <Button color="success" type="submit">
                          Uložit
                        </Button>
                      </Col>
                    </Form>
                  </Collapse>
                </Row>
              </>
            ) : (
              ""
            )}
          </Container>
        </Navbar>
      );
    } else {
      return (
        <Navbar profile={profile} active_item="Accounts">
          <Loading />
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
export default Accounts;
