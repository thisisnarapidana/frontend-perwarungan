import React, { useEffect, useState } from "react";
import useSocket from "./components/SocketComponent.js";
import SpotifyPlayerComponent from "./components/SpotifyPlayerComponent.js";
import Catalog from "./pages/Catalog.js";
import Floorplan from "./pages/Floorplan.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./tombol.css";

import SalesChart from "./SalesChart";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

let toggleModalFunction;
let setModalFunction;

function Dashboard({ auth }) {
  const { socket } = useSocket();
  const [showModal, setShowModal] = useState(false);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to set modal visibility from outside
  const setModal = () => {
    setShowModal(true);
  };

  // Assign functions to variables accessible outside the component
  toggleModalFunction = toggleModal;
  setModalFunction = setModal;

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      {auth.role === "admin" || auth.role === "clerk" ? (
        <>
          <Modal
            show={showModal}
            onHide={toggleModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Floorplan rolee={auth.role} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={toggleModal}>
                Close
              </Button>
              <Button variant="primary">Understood</Button>
            </Modal.Footer>
          </Modal>
          <SpotifyPlayerComponent rolee={auth.role} socket={socket} />
          <Tabs
            defaultActiveKey="katalog"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="denah" title="denah">
              <Floorplan rolee={auth.role || ""} />
            </Tab>
            <Tab eventKey="katalog" title="katalog">
              <Catalog rolee={auth.role || ""} />
            </Tab>
            {auth.role === "admin" && (
              <Tab eventKey="sales" title="sales">
                <SalesChart />
              </Tab>
            )}
          </Tabs>
        </>
      ) : (
        <>
          <SpotifyPlayerComponent rolee={""} socket={socket} />
          <div>
            <Catalog />
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
export { setModalFunction as setModal };
