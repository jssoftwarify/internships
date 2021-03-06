import React, { useState } from "react";
import { useAppContext } from "../providers/ApplicationProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MyModal from "./Modal.js";
import { useHistory } from "react-router-dom";
import "./styles/delete-edit.css";

const DeleteEdit = (props) => {
  const history = useHistory();
  const [{ profile }] = useAppContext();
  const [modal, setModal] = useState(false);
  function modalOpen() {
    setModal(true);
  }
  function modalClose() {
    setModal(false);
  }
  return (
    <>
      <div>
        <button
          className="icon-parent1"
          disabled={
            profile.hasOwnProperty("internship_administrator") | props.allowed
              ? false
              : true
          }
          style={{
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={(e) => {
            modalOpen(e);
          }}
        >
          <FontAwesomeIcon
            icon={faTrashAlt}
            className="icon"
            size="2x"
            color=" #ffffff"
            style={{ padding: 5 }}
          ></FontAwesomeIcon>
        </button>

        <button
          className="icon-parent2"
          style={{
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
          }}
          onClick={(e) => {
            history.push({
              pathname: props.toShow,
              state: { item: props.editedItem },
            });
          }}
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            className="icon"
            size="2x"
            color=" #ffffff"
            style={{ padding: 5 }}
          ></FontAwesomeIcon>
        </button>
      </div>

      <MyModal
        toDelete={props.toDelete}
        title={props.title}
        body={props.body}
        show={modal}
        handleClose={(e) => modalClose(e)}
      />
    </>
  );
};

export default DeleteEdit;
