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

import { Row, Col, Container, Button } from "reactstrap";

import "../../styles/navbar-style.css";

const Records = () => {
  const [{ accessToken, profile }] = useAppContext();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [internship, setInternship] = useState("");
  const [user, setUser] = useState();

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
        response.data.data.forEach((item) => {
          if (item.email === profile.email) {
            axios
              .get(`${process.env.REACT_APP_API_URL}/api/internship`, {
                headers: {
                  Authorization: "Bearer " + accessToken,
                  "Content-Type": "application/json",
                },
              })
              .then((response) => {
                response.data.forEach((item2) => {
                  if (item2.userId === item.id && item2.aktivni) {
                    setInternship(item2);
                    setUser(item);
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
      .get(`${process.env.REACT_APP_API_URL}/api/Record`, {
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
  }, [profile, accessToken]);

  function renderList() {
    const array = items.map((item) => {
      if (internship !== {}) {
        if (internship.id === item.internshipId) {
          return (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.numberOfHours}</td>
              <td>{renderDate(item.dateOfRecord)}</td>
              <td>{item.workDescription}</td>
              <td style={{ textAlign: "center" }}>
                <DeleteEdit
                  allowed={true}
                  toDelete={`Record/${item.id}`}
                  editedItem={item}
                  toShow={`records/${item.id}`}
                  title="Mazání záznamu"
                  body={`Vážně chcete smazat záznam: ${item.workDescription}?`}
                ></DeleteEdit>
              </td>
            </tr>
          );
        } else {
          return null;
        }
      } else {
        return null;
      }
    });
    return array;
  }
  const generateRecords = () => {
    setLoading(true);
    axios({
      url: `${process.env.REACT_APP_API_URL}/api/record/print/${user.id}/${internship.id}`,
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
          `Deník_${user.firstName}_${user.lastName}.html`
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
  const renderDate = (date) => {
    date = new Date(date);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();
    var datum = day + "." + month + "." + year;
    return datum;
  };
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
          <Navbar profile={profile} active_item="Denik">
            <Loading />
          </Navbar>
        );
      } else if (items) {
        return (
          <Navbar profile={profile} active_item="Denik">
            <Container style={{ color: "white" }}>
              <Row>
                <Col lg="11" md="12" sm="12">
                  {internship !== "" ? (
                    <Button
                      color="success"
                      onClick={() => history.push("records/create")}
                      style={{ marginBottom: 4 }}
                    >
                      Přidat
                    </Button>
                  ) : (
                    <Button
                      color="success"
                      onClick={() => history.push("records/create")}
                      style={{ marginBottom: 4 }}
                      disabled
                    >
                      Přidat
                    </Button>
                  )}

                  <Table responsive hover striped variant="dark">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>Počet hodin</th>
                        <th>Datum</th>
                        <th>Popis práce</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>{renderList()}</tbody>
                  </Table>
                </Col>
              </Row>
              <Row>
                <Col>
                  {items.length > 0 ? (
                    <Button color="primary" onClick={() => generateRecords()}>
                      Vygenerovat záznamy
                    </Button>
                  ) : (
                    <Button
                      color="primary"
                      onClick={() => generateRecords()}
                      disabled
                    >
                      Vygenerovat záznamy
                    </Button>
                  )}
                </Col>
              </Row>
            </Container>
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Denik">
            <Loading />
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
export default Records;
