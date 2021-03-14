import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Error from "../../messages/Error.js";

import DeleteEdit from "../../DeleteEdit.js";

import Table from "react-bootstrap/Table";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";

import { Container, Row, Col, Button, Input, InputGroup } from "reactstrap";

import "../../styles/navbar-style.css";

const Definitions = (props) => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [desc, setDesc] = useState(false);

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
          setItems(response.data);
        })
        .catch((error) => {
          setError(true);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [accessToken]);
  const searchRequest = (searchString, sortString) => {
    setLoading(true);
    axios
      .get(
        `${
          process.env.REACT_APP_API_URL
        }/api/ProfessionalExperienceDefinition?search=${searchString}&sort=${sortString}${
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
      return (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{new Date(item.start).toLocaleDateString()}</td>
          <td>{new Date(item.end).toLocaleDateString()}</td>
          <td>{item.year}</td>
          <td>{item.numberOfDays}</td>
          <td>{item.numberOfHours}</td>
          <td>
            <FontAwesomeIcon
              icon={item.active ? faCheck : faTimes}
              size="2x"
              color="#ffffff"
              style={{ padding: 5 }}
            ></FontAwesomeIcon>
          </td>
          <td>
            <FontAwesomeIcon
              icon={item.longtime ? faCheck : faTimes}
              size="2x"
              color="#ffffff"
              style={{ padding: 5 }}
            ></FontAwesomeIcon>
          </td>
          <td style={{ textAlign: "center" }}>
            <DeleteEdit
              toShow={`definitions/${item.id}`}
              toDelete={`ProfessionalExperienceDefinition/${item.id}`}
              editedItem={item}
              title="Mazání definice"
              body={`Vážně chcete smazat definici: ${item.name}`}
            ></DeleteEdit>
          </td>
          <td>
            <Button
              color={item.active ? "success" : "danger"}
              onClick={() => setStateOfDefinition(item.id)}
            >
              {item.active ? "deaktivovat" : "aktivovat"}
            </Button>
          </td>
        </tr>
      );
    });
    return array;
  }
  function setStateOfDefinition(id_input) {
    setLoading(true);
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/ProfessionalExperienceDefinition/setState/${id_input}`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }
  if (accessToken) {
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
    } else if (items) {
      return (
        <Navbar profile={profile} active_item="Definitions">
          <Container style={{ color: "white" }}>
            <Row>
              <Col lg="11" md="12" sm="12">
                <Row>
                  <Col>
                    <InputGroup className="search-input">
                      <Input
                        placeholder="vyhledat definici..."
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
                    <Button
                      color="success"
                      onClick={() => history.push("definitions/create")}
                      style={{ marginLeft: 2 }}
                    >
                      Přidat
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
                            searchRequest(search, "name");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Název
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => {
                            searchRequest(search, "start");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Začátek
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => {
                            searchRequest(search, "end");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Konec
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => {
                            searchRequest(search, "year");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Rok
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => {
                            searchRequest(search, "days");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Dny
                        </button>
                      </th>
                      <th>
                        <button
                          onClick={() => {
                            searchRequest(search, "hours");
                            setDesc(!desc);
                          }}
                          style={{
                            outline: "none",
                            border: "none",
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          Začátek
                        </button>
                      </th>
                      <th>Aktivní</th>
                      <th>Dlouhodobé</th>
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
        <Navbar profile={profile} active_item="Definitions">
          <Error />
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
export default Definitions;
