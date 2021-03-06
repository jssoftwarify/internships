import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import axios from "axios";
const MyModal = ({ handleClose, show, title, body, toDelete }) => {
  const [error, setError] = useState(false);
  async function deleteItem() {
    let temp = false;
    await axios
      .delete(`${process.env.REACT_APP_API_URL}/api/${toDelete}`)
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        setError(true);
        temp = true;
        handleClose();
      })
      .then(() => {
        handleClose();
        if (!temp) {
          window.location.reload();
        }
      });
  }
  if (show) {
    return (
      <>
        <Modal isOpen={show}>
          <ModalHeader>{title}</ModalHeader>
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={deleteItem}>
              Smazat
            </Button>
            <Button color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  } else if (error) {
    return (
      <>
        <Modal isOpen={error}>
          <ModalHeader>Chyba</ModalHeader>
          <ModalBody>Nastala chyba s mazáním entity</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setError(false)}>
              Ok
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  } else {
    return null;
  }
};

export default MyModal;
