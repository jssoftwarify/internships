import React from "react";
import { Input, InputGroup, Row, Col } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faBuilding,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import "./styles/table-style.css";

const SearchCreate = (props) => {
  const history = useHistory();
  return (
    <Row>
      <Col lg="4">
        <InputGroup className="search-input">
          <Input placeholder={props.placeholder} />
        </InputGroup>
      </Col>
      <Col lg="1">
        <button
          style={{
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
            color: "white",
          }}
          onClick={() => {
            history.push(props.to);
          }}
        >
          <FontAwesomeIcon icon={faPlus} className="addIcon" />
        </button>
      </Col>

      {props.internship ? (
        <>
          {" "}
          <Col lg="1" className="my-auto">
            <button
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "transparent",
                color: "white",
              }}
              onClick={() => {
                history.push("companies/create");
              }}
            >
              <FontAwesomeIcon icon={faBuilding} className="addIcon" />
            </button>
          </Col>
          <Col lg="1" className="my-auto">
            <button
              style={{
                outline: "none",
                border: "none",
                backgroundColor: "transparent",
                color: "white",
              }}
              onClick={() => {
                history.push("/companies/create/address/");
              }}
            >
              <FontAwesomeIcon icon={faMapMarkerAlt} className="addIcon" />
            </button>
          </Col>
        </>
      ) : null}
    </Row>
  );
};
export default SearchCreate;
