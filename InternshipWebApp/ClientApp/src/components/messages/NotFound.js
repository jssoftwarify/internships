import React from "react";
import { useAppContext } from "../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import { Button, Container, Row, Col } from "reactstrap";

const NotFound = (props) => {
  const [{ profile }] = useAppContext();
  const history = useHistory();
  return (
    <Container style={{ color: "white" }}>
      <Row className="error-header">
        <Col>Oops 404</Col>
      </Row>
      <Row className="error-body">
        <Col>
          Omlouváme se, ale požadovaná stránka nebyla na našem webu nalezena
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            color="danger"
            onClick={() => {
              if (profile.hasOwnProperty("internship_administrator")) {
                history.push("/internships");
              } else {
                history.push("/home");
              }
            }}
            style={{ marginTop: "10px" }}
            size="lg"
          >
            Zpět na hlavní stránku
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
