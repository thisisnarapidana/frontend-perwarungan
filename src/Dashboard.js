import React, { useState, useEffect } from "react";
import apiUrl from "./apiConfig.js";
import SpotifyPlayerComponent from "./components/SpotifyPlayerComponent.js";
import Catalog from "./pages/Catalog.js";
import Floorplan from "./pages/Floorplan.js";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./tombol.css";

import SalesChart from "./SalesChart";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Item from "./components/Item.js";

import {
  getMyTransactions,
  getTransactionInProcess,
  setClerkFollowUp,
} from "./transactionCaller.js";

let toggleModalFunction;
let setModalFunction;

function Dashboard({ socket, auth }) {
  const [showModal, setShowModal] = useState(false);
  const [activeKey, setActiveKey] = useState("katalog");
  const [order, setOrder] = useState([]);

  useEffect(() => {
    if (sessionStorage("session_id") === "") return;
    if (auth.role === "clerk") getTransactionOnNewTransaction();
    else if (auth.role === "guest") getmytransactions();
  }, []);

  const handleTabSelect = (key) => {
    setActiveKey(key);
  };

  // Function to toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to set modal visibility from outside
  const setModal = () => {
    getTransactionOnNewTransaction();
    setShowModal(true);
    setActiveKey("denah");
  };

  const handleClerkJob = async (transaction_id) => {
    try {
      await setClerkFollowUp(transaction_id);
      getTransactionOnNewTransaction();
    } catch (error) {
      console.error("Error fetching in-process transactions: ", error);
    }
  };

  const getTransactionOnNewTransaction = async () => {
    try {
      const response = await getTransactionInProcess();
      setOrder(response.data || []);
    } catch (error) {
      console.error("Error fetching in-process transactions: ", error);
    }
  };

  const getmytransactions = async () => {
    try {
      const response = await getMyTransactions();
      setOrder(response.data || []);
    } catch (error) {
      console.error("Error fetching in-process transactions: ", error);
    }
  };

  // Assign functions to variables accessible outside the component
  toggleModalFunction = toggleModal;
  setModalFunction = setModal;

  return (
    <div>
      <Modal
        show={showModal}
        onHide={toggleModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Pesanann</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {order.length === 0 ? (
            <p>loading..</p>
          ) : (
            order.map((transaction) => (
              <div>
                <h1>meja nomor {transaction.table.no_table}</h1>
                {transaction.detailed_transactions.map((detail) => (
                  <div
                    key={detail.detailed_transaction_id}
                    className="rectangle border"
                  >
                    <Item
                      //below is for clerk
                      key={detail.detailed_transaction_id}
                      item={detail.item}
                      apiUrl={apiUrl}
                      startqty={detail.qty_stock_change * -1}
                      role={"clerk"}
                      forDisplay={"listpesanan"}
                      fordisplay={"listpesanan"}
                      clerkJobHandler={() =>
                        handleClerkJob(transaction.transaction_id)
                      }
                      transactionFollowUp={transaction.status}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
      {auth.role === "admin" || auth.role === "clerk" ? (
        <>
          <SpotifyPlayerComponent rolee={auth.role} socket={socket} />
          <Tabs
            activeKey={activeKey}
            onSelect={handleTabSelect}
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
          <SpotifyPlayerComponent socket={socket} />
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
