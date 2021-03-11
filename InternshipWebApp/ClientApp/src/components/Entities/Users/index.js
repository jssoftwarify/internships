import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Unauthorized from "../../messages/Unauthorized";
import Error from "../../messages/Error.js";
import { useHistory } from "react-router-dom";

import Table from "react-bootstrap/Table";

import { Row, Col, Container, Input, InputGroup, Button } from "reactstrap";

import "../../styles/navbar-style.css";

const Users = (props) => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [desc, setDesc] = useState(false);
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Users`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setItems(response.data.data);
      })
      .catch((error) => {
        setError(true);
      });

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/internship`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setInternships(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [accessToken]);
  const searchRequest = (searchString, sortString) => {
    setLoading(true);
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/Users?search=${searchString}&sort=${sortString}${
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
        setItems(response.data.data);
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
      var internshipIndex = 0;
      internships.forEach((internship) => {
        if (internship.userId === item.id) {
          internshipIndex = internship.id;
        }
      });
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.firstName}</td>
          <td>{item.lastName}</td>
          <td>{item.email}</td>
          <td>{item.telephoneNumber !== null ? item.telephoneNumber : ""}</td>
          <td>
            {item.specialization !== null ? item.specialization.name : ""}
          </td>
          <td>{item.classroom !== null ? item.classroom.name : ""}</td>
          <td>
            {internshipIndex !== 0 ? (
              <Button
                color="primary"
                onClick={() => history.push(`internships/${internshipIndex}`)}
              >
                Praxe
              </Button>
            ) : (
              ""
            )}
          </td>
        </tr>
      );
    });
    return array;
  }
  if (accessToken) {
    if (profile.hasOwnProperty("internship_administrator")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Users">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Users">
            <Loading />
          </Navbar>
        );
      } else if (items && internships) {
        return (
          <Navbar profile={profile} active_item="Users">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="11" md="12" sm="12">
                  <Row>
                    <Col>
                      <InputGroup className="search-input">
                        <Input
                          placeholder="vyhledat třídu..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                    <Col style={{ padding: 0 }}>
                      <Button
                        color="primary"
                        onClick={(e) => searchRequest(search, "")}
                        style={{ marginRight: 2 }}
                      >
                        Hledat
                      </Button>
                    </Col>
                  </Row>

                  <Table responsive hover striped variant="dark">
                    <thead>
                      <tr key={-1}>
                        <th>Id</th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "firstname");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Jméno
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "lastname");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Přijmení
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "email");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            E-mail
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "phoneNumber");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Tel
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "specialization");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Obor
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              searchRequest(search, "classroom");
                              setDesc(!desc);
                            }}
                            style={{
                              outline: "none",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                          >
                            Třída
                          </button>
                        </th>
                        <th>Praxe</th>
                      </tr>
                    </thead>
                    <tbody>{renderList()}</tbody>
                  </Table>
                </Col>
              </Row>
            </Container>
            ß
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Users">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Users">
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
export default Users;
