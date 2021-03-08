import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Error from "../../messages/Error.js";
import Unauthorized from "../../messages/Unauthorized.js";

import DeleteEdit from "../../DeleteEdit.js";

import Table from "react-bootstrap/Table";
import { faPen, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Row,
  Col,
  Container,
  Button,
  Jumbotron,
  Alert,
  Input,
  InputGroup,
} from "reactstrap";

import "../../styles/table-style.css";
import "../../styles/navbar-style.css";
import "../../styles/delete-edit.css";
import "../../styles/map-style.css";

const Internships = () => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [user, setUser] = useState();
  const [users, setUsers] = useState();
  const [companies, setCompanies] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [search, setSearch] = useState("");
  const [desc, setDesc] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`)
      .then((response) => {
        setUsers(response.data.data);
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
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/internship`)
              .then((response) => {
                setItems(response.data);
              })
              .catch((error) => {
                setError(true);
              });

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
          }
        });
      })
      .catch((error) => {});
  }, [profile]);
  const searchRequest = (searchString, sortString) => {
    setLoading(true);
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/Internship?search=${searchString}&sort=${sortString}${
          desc ? `_desc` : `_asc`
        }`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  };
  function renderList() {
    const array = items.map((item) => {
      let userName = "";
      users.forEach((user) => {
        if (user.id === item.userId) {
          userName = `${user.firstName} ${user.lastName}`;
        }
      });
      if (profile.hasOwnProperty("internship_administrator")) {
        return (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.company.name}</td>
            <td>{`${item.companyAddress.streetName}
                  ${item.companyAddress.houseNumber},
                  ${item.companyAddress.postalCode}
                  ${item.companyAddress.city}`}</td>
            <td>{item.professionalExperienceDefinition.name}</td>
            <td>{userName}</td>

            <td style={{ textAlign: "center" }}>
              <DeleteEdit
                toShow={`internships/${item.id}`}
                toDelete={`Internship/${item.id}`}
                editedItem={item}
                title="Mazání praxe"
                body={`Vážně chcete smazat praxi: ${item.id}`}
              ></DeleteEdit>
            </td>
          </tr>
        );
      } else if (profile.hasOwnProperty("internship_student")) {
        if (user) {
          if (user.id === item.userId) {
            return (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.company.name}</td>
                <td>{`${item.companyAddress.streetName}
                  ${item.companyAddress.houseNumber},
                  ${item.companyAddress.postalCode}
                  ${item.companyAddress.city}`}</td>
                <td>{item.professionalExperienceDefinition.name}</td>
                <td>{userName}</td>
                <td style={{ textAlign: "center" }}>
                  <DeleteEdit
                    allowed={true}
                    toShow={`internships/${item.id}`}
                    toDelete={`Internship/${item.id}`}
                    editedItem={item}
                    title="Mazání praxe"
                    body={`Vážně chcete smazat praxi: ${item.id}`}
                  ></DeleteEdit>
                </td>
                <td>
                  <Button
                    disabled={item.aktivni ? true : false}
                    color={item.aktivni ? "success" : "secondary"}
                    onClick={() => setStateOfInternship(item.id)}
                  >
                    {item.aktivni ? "aktivní" : "aktivovat"}
                  </Button>
                </td>
              </tr>
            );
          } else {
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
    return array;
  }
  const checkArray = (array) => {
    var count = 0;
    array.forEach((item) => {
      if (item !== null) {
        count++;
      }
    });
    if (count !== 0) {
      return true;
    } else {
      return false;
    }
  };
  const setStateOfInternship = (id_input) => {
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/internship/setState/${id_input}`
      )
      .then((response) => {
        history.push("/home");
      })
      .catch((error) => {
        setError(true);
      });
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
  const renderCompanyAddresses = (id) => {
    if (addresses) {
      const array = addresses.map((item, index) => {
        var empty = true;
        items.forEach((item2) => {
          if (
            (item2.companyAddress.id === item.id) &
            item2.professionalExperienceDefinition.active &
            item2.aktivni &
            (item2.companyAddress.freeForInspection === false) &
            (item2.companyAddress.userId === user.id)
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
                      color="danger"
                      style={{ marginLeft: "10px" }}
                      onClick={() => updateCompanyAddress(item)}
                    >
                      Odebrat
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
  const renderAddressUsers = (id) => {
    if (items) {
      const array = items.map((item, index) => {
        if (
          (item.companyAddress.id === id) &
          item.professionalExperienceDefinition.active &
          item.aktivni
        ) {
          users.push(item.userId);
          return (
            <Table key={index} borderless>
              <tbody>{renderUser(users, item.id)}</tbody>
            </Table>
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
  const renderUser = (userList, internshipId) => {
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
            <tr key={index} style={{ color: "#A9A9A9" }}>
              <td>
                <h4>
                  {`${item.firstName} ${item.lastName}`}{" "}
                  <button
                    className="icon-parent1"
                    style={{
                      outline: "none",
                      border: "none",
                      backgroundColor: "transparent",
                    }}
                    onClick={() => {
                      !checkInternshipForInspection(internshipId).contains
                        ? history.push(`inspections/create/${internshipId}`)
                        : history.push({
                            pathname: `inspections/${internshipId}`,
                            state: checkInternshipForInspection(internshipId)
                              .inspection,
                          });
                    }}
                  >
                    {!checkInternshipForInspection(internshipId).contains ? (
                      <FontAwesomeIcon
                        icon={faPen}
                        className="icon"
                        size="1x"
                        color="#A9A9A9"
                        style={{ padding: 3 }}
                      ></FontAwesomeIcon>
                    ) : (
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="icon"
                        size="1x"
                        color="#A9A9A9"
                        style={{ padding: 2 }}
                      ></FontAwesomeIcon>
                    )}
                  </button>
                </h4>
              </td>
            </tr>
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
          UserId: null,
          FreeForInspection: true,
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
        history.push("/home");
        setLoading(false);
      });
  };

  const checkInternshipForInspection = (id) => {
    var contains = false;
    var inspection;
    items.forEach((item) => {
      if ((item.id === id) & (item.inspection !== null)) {
        contains = true;
        inspection = item.inspection;
      }
    });
    return { contains: contains, inspection: inspection };
  };
  if (accessToken) {
    if (
      profile.hasOwnProperty("internship_administrator") |
      profile.hasOwnProperty("internship_student")
    ) {
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
      } else if (items) {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="11" md="12" sm="12">
                  <Row>
                    <Col lg="6" md="8" sm="12" xs="12">
                      <InputGroup className="search-input">
                        <Input
                          placeholder="vyhledat praxi..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col
                      lg="1"
                      md="1"
                      sm="6"
                      xs="6"
                      className="button-align-center "
                    >
                      <Button
                        className=" button-width"
                        color="primary"
                        onClick={(e) => searchRequest(search, "")}
                        style={{ marginRight: 2, marginLeft: 2 }}
                      >
                        Hledat
                      </Button>
                    </Col>
                    <Col
                      lg="1"
                      md="1"
                      sm="6"
                      xs="6"
                      className="button-align-center"
                    >
                      <Button
                        className=" button-width"
                        color="success"
                        onClick={() => history.push("internships/create")}
                        style={{ marginLeft: 2, marginRight: 2 }}
                      >
                        Přidat
                      </Button>
                    </Col>
                    <Col
                      lg="1"
                      md="1"
                      sm="6"
                      xs="6"
                      className="button-align-center"
                    >
                      <Button
                        className=" button-width"
                        style={{ marginLeft: 2, marginRight: 2 }}
                        onClick={() => {
                          history.push("companies/create");
                        }}
                      >
                        +Firma
                      </Button>
                    </Col>
                    <Col
                      lg="1"
                      md="1"
                      sm="6"
                      xs="6"
                      className="button-align-center"
                    >
                      <Button
                        className=" button-width"
                        style={{ marginLeft: 2, marginRight: 2 }}
                        onClick={() => {
                          history.push("/companies/create/address/");
                        }}
                      >
                        +Adresa
                      </Button>
                    </Col>
                  </Row>

                  <Table responsive hover striped variant="dark">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "company");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Firma
                          </button>
                        </th>
                        <th>Adresa</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "definition");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Definice
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "student");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Student
                          </button>
                        </th>

                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{renderList()}</tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Internships">
            <Loading />
          </Navbar>
        );
      }
    } else if (profile.hasOwnProperty("internship_controller")) {
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
      } else if (user) {
        return (
          <Navbar profile={profile} active_item="Internships">
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
          <Navbar profile={profile} active_item="Internships">
            <Loading />
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
export default Internships;
