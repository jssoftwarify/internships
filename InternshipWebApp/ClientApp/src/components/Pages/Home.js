import React, { useEffect, useState } from "react";
import { useAppContext } from "../../providers/ApplicationProvider.js";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../layouts/layout-components/Navbar";
import MessageLayout from "../layouts/MessageLayout.js";
import Login from "./Login";
import Loading from "../Pages/Loading";
import Error from "../messages/Error.js";

import {
  Container,
  Alert,
  Jumbotron,
  Row,
  Collapse,
  Col,
  Input,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Button,
} from "reactstrap";
import "../styles/navbar-style.css";
import Unauthorized from "../messages/Unauthorized.js";

const Home = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [internship, setInternship] = useState();
  const [internships, setInternships] = useState();
  const [company, setCompany] = useState({ data: {} });
  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [isOpen, setIsOpen] = useState([true, true, true]);

  const toggle = (index) => {
    let array = [...isOpen];
    array[index] = !isOpen[index];
    setIsOpen(array);
  };

  useEffect(() => {
    setLoading(true);
    var userId = null;
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`)
      .then((response) => {
        setUsers(response.data.data);
        response.data.data.forEach((item) => {
          if (item.email === profile.email) {
            userId = item.id;
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/Users/${userId}`)
              .then((response) => {
                setUser(response.data);
              })
              .catch((error) => {
                setError(true);
              });
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/internship`)
              .then((response) => {
                setInternships(response.data);
                response.data.forEach((item2) => {
                  if (
                    (item2.userId === userId) &
                    item2.aktivni &
                    (item2.professionalExperienceDefinition.active === true)
                  ) {
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
      .catch((error) => {});

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/CompanyAddress`)
      .then((response) => {
        setAddresses(response.data);
      })
      .catch((error) => {
        setError(true);
      });
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Company`)
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [profile]);

  const validate = (values) => {
    const errors = {};

    if (!values.company) {
      errors.company = "Nutné vyplnit!";
    } else if (!/^\d{8}$/.test(values.company)) {
      errors.company = "Špatný formát!";
    }
    return errors;
  };
  const formik = useFormik({
    initialValues: {
      company: "",
    },
    validate,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/Company/${values.company}`, {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          setCompany(response);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setSubmitting(false);
        });
    },
  });

  function checkArray(array) {
    var count = 0;
    array.forEach((item) => {
      if (item != null) {
        count++;
      }
    });
    if (count !== 0) {
      return true;
    } else {
      return false;
    }
  }

  const renderCompany = () => {
    const array = addresses.map((item) => {
      if (parseInt(item.companyId) === parseInt(company.data.id)) {
        return (
          <li key={item.id}>
            {`${item.streetName} ${item.houseNumber} ${item.city} ${item.postalCode}`}
          </li>
        );
      } else {
        return null;
      }
    });
    return (
      <Card
        inverse
        style={{ backgroundColor: "#222831", borderColor: "#222831" }}
      >
        <CardBody>
          <CardTitle tag="h5">{company.data.name}</CardTitle>
          <hr />
          <ul>{array}</ul>
        </CardBody>
      </Card>
    );
  };
  const renderCompanyAddresses = (id) => {
    if (addresses) {
      const array = addresses.map((item, index) => {
        var empty = true;
        internships.forEach((item2) => {
          if (
            (item2.companyAddress.id === item.id) &
            item2.professionalExperienceDefinition.active &
            item2.aktivni &
            item2.companyAddress.freeForInspection
          ) {
            empty = false;
          }
        });
        if ((item.company.id === id) & !empty) {
          return (
            <div key={index}>
              <Row>
                <Col>
                  <h3>
                    {`${item.streetName}
                  ${item.houseNumber},
                  ${item.postalCode}
                  ${item.city}`}
                    <Button
                      color="success"
                      style={{ marginLeft: "10px" }}
                      onClick={() => updateCompanyAddress(item)}
                    >
                      Přidat
                    </Button>
                  </h3>
                </Col>
              </Row>
              <Row>{renderAddressUsers(item.id)}</Row>
            </div>
          );
        } else if (empty) {
          return null;
        } else {
          return null;
        }
      });
      let arrayCheck = false;
      array.forEach((item) => {
        if ((item !== null) & (item !== undefined)) {
          arrayCheck = true;
        }
      });
      if (arrayCheck) {
        return array;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
  const renderUser = (userList) => {
    if (userList) {
      const array = users.map((item, index) => {
        var user = false;
        userList.forEach((item2) => {
          if ((item.id === item2) & (item.controller === false)) {
            user = true;
          }
        });
        if (user) {
          return (
            <li key={index} style={{ color: "#A9A9A9" }}>
              <h4>{`${item.firstName} ${item.lastName}`}</h4>
            </li>
          );
        } else {
          return null;
        }
      });
      return array;
    } else {
      return null;
    }
  };
  const renderAddressUsers = (id) => {
    if (internships) {
      const array = internships.map((item, index) => {
        if (
          (item.companyAddress.id === id) &
          item.professionalExperienceDefinition.active &
          item.aktivni
        ) {
          users.push(item.userId);
          return <ul key={index}>{renderUser(users)}</ul>;
        } else {
          return null;
        }
      });
      return array;
    } else {
      return null;
    }
  };
  const renderControllerContent = () => {
    const array = companies.map((item, index) => {
      if (renderCompanyAddresses(item.id) !== null) {
        return (
          <div key={index}>
            <Row xs="12" sm="12" md="12" lg="12">
              <Col>
                <h1>{item.name}</h1>
              </Col>
            </Row>
            <Row xs="12" sm="12" md="12" lg="12" key={index}>
              <Col>
                {" "}
                <Jumbotron
                  style={{
                    backgroundColor: "#383c44",
                    color: "white",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  {renderCompanyAddresses(item.id)}
                  <hr className="my-2" />
                </Jumbotron>
              </Col>
            </Row>
          </div>
        );
      } else {
        return null;
      }
    });
    return array;
  };
  const updateCompanyAddress = (address) => {
    setLoading(true);
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/CompanyAddress/${address.id}`,
        {
          StreetName: address.streetName,
          HouseNumber: address.houseNumber,
          City: address.city,
          PostalCode: address.postalCode,
          Headquarter: address.headquarter,
          CompanyId: parseInt(address.companyId),
          UserId: user.id,
          FreeForInspection: false,
          Latitude: address.latitude,
          Longtitude: address.longtitude,
        },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {})
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
        history.push("/internships");
      });
  };

  const generateContract = () => {
    setLoading(true);
    axios({
      url: `${process.env.REACT_APP_API_URL}/api/Internship/contract?userId=${user.id}&internshipId=${internship.id}`,
      method: "GET",
      responseType: "blob",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "text/html",
      },
    })
      .then((response) => {
        let fileContent = new Blob([response.data]);
        const url = window.URL.createObjectURL(fileContent);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Smlouva_${user.firstName}_${user.lastName}.html`
        );
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  };

  if (accessToken) {
    if (error) {
      return (
        <Navbar profile={profile} active_item="Home">
          <Error />
        </Navbar>
      );
    } else if (loading) {
      return (
        <Navbar profile={profile} active_item="Home">
          <Loading />
        </Navbar>
      );
    } else if (user) {
      if (profile.hasOwnProperty("internship_student")) {
        if (internship) {
          return (
            <Navbar profile={profile} active_item="Home">
              <Container style={{ color: "white" }}>
                <Row>
                  <Col className="text-center">
                    <h1>{internship.company.name}</h1>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <p>{`${internship.companyAddress.streetName} ${internship.companyAddress.houseNumber}, ${internship.companyAddress.city}, ${internship.companyAddress.postalCode}`}</p>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col>
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      <h2>{internship.jobDescription}</h2>
                      <hr className="my-2" />
                      <p>{internship.additionalInformations}</p>
                    </Jumbotron>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      <h2>Kontaktní osoba</h2>
                      <hr className="my-2" />
                      <p>{internship.companyContactPerson}</p>
                      <p>
                        <a
                          href={`tel:${internship.companiesContacPersonTelephoneNumber}`}
                        >
                          {internship.companiesContacPersonTelephoneNumber}
                        </a>
                      </p>
                      <p>
                        <a
                          href={`mailto:${internship.companiesContactPersonEmail}`}
                        >
                          {internship.companiesContactPersonEmail}
                        </a>
                      </p>
                    </Jumbotron>
                  </Col>
                  <Col>
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      <h2>Zástupce firmy</h2>
                      <hr className="my-2" />
                      <p>{internship.companyRepresentative}</p>
                      <p>
                        <a
                          href={`tel:${internship.companiesRepresentativeTelephoneNumber}`}
                        >
                          {internship.companiesRepresentativeTelephoneNumber}
                        </a>
                      </p>
                      <a
                        href={`mailto:${internship.companiesRepresentativeEmail}`}
                      >
                        {internship.companiesRepresentativeEmail}
                      </a>
                      <p></p>
                    </Jumbotron>
                    <Button color="primary" onClick={() => generateContract()}>
                      Generování smlouvy
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        } else {
          return (
            <Navbar profile={profile} active_item="Home">
              <Container style={{ color: "white" }}>
                <Alert color="danger">
                  Nemáš ještě vytvořenou praxi v daném období (je možné, že
                  pouze nebyla aktivována)
                </Alert>
                <Row style={{ marginBottom: "20px" }}>
                  <Col>
                    <h1>Kroky, které jsou potřeba dodržet: </h1>
                  </Col>
                </Row>
                <Row>
                  <Col xs="12" sm="12" md="12" lg="12">
                    <Jumbotron
                      style={{
                        backgroundColor: "#383c44",
                        color: "white",
                        padding: "10px",
                      }}
                    >
                      {!user.classroomId & !user.spezializationId ? (
                        <>
                          <h1
                            onClick={() => toggle(0)}
                            className="display-5"
                            style={
                              isOpen[0] === false
                                ? {
                                    textDecoration: "line-through",
                                    color: "#A9A9A9",
                                  }
                                : {}
                            }
                          >
                            1. Doplnit informace
                          </h1>
                          <Collapse isOpen={isOpen[0]}>
                            <p className="lead">
                              Je potřeba doplnit všechny potřebné informace ve
                              vašem profilu
                            </p>
                            <ol>
                              <li>Třída</li>
                              <li>Obor</li>
                            </ol>
                            <hr />
                          </Collapse>
                        </>
                      ) : (
                        ""
                      )}

                      <h1
                        onClick={() => toggle(1)}
                        className="display-5"
                        style={
                          isOpen[1] === false
                            ? {
                                textDecoration: "line-through",
                                color: "#A9A9A9",
                              }
                            : {}
                        }
                      >
                        Zkontrolovat firmu a adresu
                      </h1>
                      <Collapse isOpen={isOpen[1]}>
                        <p className="lead">
                          Před založením firmy je potřeba zkontrolovat 2 věci,
                          zaprvé zda je u nás založena vaše firma a adresa, kde
                          budete vykonávat vaši praxi
                        </p>
                        <Form onSubmit={formik.handleSubmit}>
                          <FormGroup>
                            <Row>
                              <Col
                                sm="12"
                                lg="6"
                                md="6"
                                className="text-right"
                                style={{ width: "100%" }}
                              >
                                <Input
                                  type="text"
                                  name="company"
                                  id="company"
                                  placeholder="26476215"
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  value={formik.values.company}
                                />
                                {formik.errors.company &&
                                formik.touched.company ? (
                                  <Alert
                                    className="text-left"
                                    style={{ marginTop: "10px" }}
                                    color="danger"
                                  >
                                    {formik.errors.company}
                                  </Alert>
                                ) : null}
                              </Col>
                              <Col sm="12" lg="6" md="6" className="text-left">
                                <Button
                                  color="success"
                                  type="submit"
                                  style={{ margin: "1px" }}
                                >
                                  {!formik.isSubmitting ? "Hledat" : "Pracuji"}
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    history.push("/companies/create")
                                  }
                                  style={{ margin: "1px" }}
                                >
                                  Přidat firmu
                                </Button>
                                <Button
                                  color="primary"
                                  onClick={() =>
                                    history.push("/companies/create/address/")
                                  }
                                  style={{ margin: "1px" }}
                                >
                                  Přidat adresu
                                </Button>
                              </Col>
                            </Row>
                          </FormGroup>
                        </Form>
                        <Row>
                          <Col>
                            {Object.keys(company.data).length !== 0 ? (
                              renderCompany()
                            ) : Object.keys(company.data).length === 0 &&
                              company.statusText !== "No Content" ? (
                              ""
                            ) : (
                              <Alert color="danger">Firma nenalezena!</Alert>
                            )}
                          </Col>
                        </Row>
                        <hr />
                      </Collapse>
                      <h1
                        onClick={() => toggle(2)}
                        className="display-5"
                        style={
                          isOpen[2] === false
                            ? {
                                textDecoration: "line-through",
                                color: "#A9A9A9",
                              }
                            : {}
                        }
                      >
                        Založit si praxi
                      </h1>
                      <Collapse isOpen={isOpen[2]}>
                        <p className="lead">
                          Pokud jste úspěšně zvládli první dva kroky, tak už se
                          můžete rovnou vrhnout na vytvoření praxe
                        </p>
                        <Button
                          color="primary"
                          onClick={() => {
                            history.push("/internships/create");
                          }}
                        >
                          Založit praxi!
                        </Button>
                      </Collapse>
                      <hr />
                    </Jumbotron>
                  </Col>
                </Row>
              </Container>
            </Navbar>
          );
        }
      } else if (profile.hasOwnProperty("internship_controller")) {
        if (internships) {
          return (
            <Navbar profile={profile} active_item="Home">
              <Container style={{ color: "white" }}>
                {checkArray(renderControllerContent()) ? (
                  renderControllerContent()
                ) : (
                  <Alert color="danger">
                    Nejsou obsaženy žádné volné praxe ke kontrole
                  </Alert>
                )}
              </Container>
            </Navbar>
          );
        } else {
          return (
            <Navbar profile={profile} active_item="Home">
              <Loading />
            </Navbar>
          );
        }
      } else {
        return (
          <Navbar profile={profile} active_item="Home">
            <Unauthorized />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Home">
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
export default Home;
