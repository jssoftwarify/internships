import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading";
import Unauthorized from "../../messages/Unauthorized.js";
import Error from "../../messages/Error.js";

import DeleteEdit from "../../DeleteEdit.js";

import Table from "react-bootstrap/Table";

import { Row, Col, Container, Input, InputGroup, Button } from "reactstrap";

import "../../styles/navbar-style.css";

const Classrooms = (props) => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [desc, setDesc] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(accessToken);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/Classroom`, {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        setItems(response.data);
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
        }/api/Classroom?search=${searchString}&sort=${sortString}${
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
          <td style={{ textAlign: "center" }}>
            <DeleteEdit
              toDelete={`Classroom/${item.id}`}
              editedItem={item}
              toShow={`classrooms/${item.id}`}
              title="Mazání třídy"
              body={`Vážně chcete smazat třídu: ${item.name}?`}
            ></DeleteEdit>
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
      } else if (items) {
        return (
          <Navbar profile={profile} active_item="Classrooms">
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
                      <Button
                        color="success"
                        onClick={() => history.push("classrooms/create")}
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
                            Třída
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
export default Classrooms;
