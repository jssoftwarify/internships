import React, { useState, useEffect } from "react";
import { useAppContext } from "../../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import axios from "axios";

import Navbar from "../../layouts/layout-components/Navbar";
import MessageLayout from "../../layouts/MessageLayout.js";
import Login from "../../Pages/Login";
import Loading from "../../Pages/Loading.js";
import Unauthorized from "../../messages/Unauthorized.js";
import Error from "../../messages/Error.js";

import { Button, Form, Container, Row, Col, Jumbotron } from "reactstrap";

import { ReactComponent as Icon } from "../../../assets/companyIcon.svg";
import "../../styles/navbar-style.css";
import "../../styles/detail-style.css";

const CompanyDetail = (props) => {
  const history = useHistory();
  const [{ accessToken, profile }] = useAppContext();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [item, setItem] = useState();

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/Company/${props.match.params.id}`
      )
      .then((response) => {
        console.log(response);
        setItem(response.data);
      })
      .catch((error) => {
        setError(true);
      })
      .then(() => {
        setLoading(false);
      });
  }, [props.match.params.id]);

  if (accessToken) {
    if (profile.hasOwnProperty("internship_administrator")) {
      if (error) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Error />
          </Navbar>
        );
      } else if (loading) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Loading />
          </Navbar>
        );
      } else if (item) {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Container>
              <Row className="justify-content-center">
                <Col sm="12" lg="7" md="10" className="text-center">
                  <Jumbotron
                    style={{
                      backgroundColor: "#383c44",
                      color: "white",
                      padding: "10px",
                    }}
                  >
                    <Container>
                      <Row>
                        <Col
                          xs="12"
                          sm="12"
                          lg="12"
                          md="12"
                          style={{
                            wordWrap: "break-word",
                            paddingTop: "20px",
                          }}
                          className="text-right my-auto"
                        >
                          <Row>
                            <Col xs="6" sm="6" lg="6" md="6">
                              <Icon
                                fill="white"
                                style={{
                                  color: "white",
                                  height: "50px",
                                  width: "auto",
                                }}
                              ></Icon>
                            </Col>
                            <Col
                              xs="6"
                              sm="6"
                              lg="6"
                              md="6"
                              className="text-left my-auto"
                            >
                              <h3>{item.id}</h3>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="4"
                              sm="4"
                              lg="3"
                              md="4"
                              className="text-right"
                            >
                              <h3 style={{ color: "#A9A9A9" }}>Název </h3>
                            </Col>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h2>{item.name}</h2>
                            </Col>
                          </Row>
                          <hr />
                          <Row>
                            <Col
                              xs="4"
                              sm="4"
                              lg="3"
                              md="4"
                              className="text-right"
                            >
                              <h3 style={{ color: "#A9A9A9" }}>IČO </h3>
                            </Col>
                            <Col
                              xs="8"
                              sm="8"
                              lg="9"
                              md="8"
                              className="text-left"
                            >
                              <h2>{item.companyIdentificationNumber}</h2>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Container>
                  </Jumbotron>
                  <Row>
                    <Col sm="12" lg="12" md="12" className="text-right">
                      <Form>
                        <Button
                          size="lg"
                          color="danger"
                          onClick={() => {
                            history.push("/companies");
                          }}
                          style={{ margin: 5 }}
                        >
                          Zpět
                        </Button>
                      </Form>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Container>
          </Navbar>
        );
      } else {
        return (
          <Navbar profile={profile} active_item="Companies">
            <Loading />
          </Navbar>
        );
      }
    } else {
      return (
        <Navbar profile={profile} active_item="Companies">
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
export default CompanyDetail;
