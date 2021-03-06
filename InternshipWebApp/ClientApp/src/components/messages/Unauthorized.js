import React from "react";
import { useAppContext } from "../../providers/ApplicationProvider";
import { useHistory } from "react-router-dom";

import { Button, Container, Row, Col } from "reactstrap";

const Unauthorized = (props) => {
  const history = useHistory();
  const [{ userManager }] = useAppContext();

  return (
    <Container style={{ color: "white" }}>
      <Row className="error-header">
        <Col>Zde nemáte přístup</Col>
      </Row>
      <Row className="error-body">
        <Col>
          Nemáte dostatečná oprávnění pro vstup na tuto stránku, pokud
          nesouhlasíte, tak se obraťte na administrátora
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            color="danger"
            onClick={() => {
              history.goBack();
            }}
            style={{ marginTop: "10px" }}
            size="lg"
          >
            Zpět
          </Button>
          <Button
            color="danger"
            onClick={() => {
              userManager.signoutRedirect();
            }}
            style={{ marginTop: "10px", marginLeft: "10px" }}
            size="lg"
          >
            Odhlásit se
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;
