import React, { useState, useEffect } from "react";
import apiUrl from "../apiConfig";
import useSocket from "../components/SocketComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthentication } from "../userCaller.js";
import Navbar from "../Navbar";
import Dashboard from "../Dashboard";
import Login from "./Login";
import Scan from "./Scan";
import TableComponent from "./TableComponent";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Modal from "react-bootstrap/Modal";
import Item from "../components/Item";

import {
  getMyTransactions,
  getTransactionInProcess,
  setClerkFollowUp,
} from "../transactionCaller.js";

let setModalFunction;

const Main = () => {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {
  const { socket } = useSocket();

  const authenticationResponse = useAuthentication();

  let [auth, setAuth] = useState({ success: false, user_id: "", role: "" });

  const [showModal, setShowModal] = useState(false);
  const [order, setOrder] = useState([]);

  // Function to toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Function to set modal visibility from outside
  const setModal = () => {
    if (localStorage.getItem("session_id") === "") return;
    if (auth.role === "clerk") getTransactionOnNewTransaction();
    else getmytransactions();
    setShowModal(true);
    // setActiveKey("denah");
  };

  const handleClerkJob = async (detailed_transaction_id) => {
    try {
      await setClerkFollowUp(detailed_transaction_id);
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

  setModalFunction = setModal;

  useEffect(() => {
    if (!socket) return;

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (authenticationResponse && authenticationResponse.success)
      setAuth(authenticationResponse);
  }, [authenticationResponse]);

  return (
    <>
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
                <h1>
                  meja nomor{" "}
                  {transaction.table !== null && transaction.table.no_table}
                </h1>
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
                      role={auth.role}
                      forDisplay={"listpesanan"}
                      fordisplay={"listpesanan"}
                      clerkJobHandler={() =>
                        handleClerkJob(detail.detailed_transaction_id)
                      }
                      paymentStatus={transaction.payment_status}
                      transactionFollowUp={detail.status}
                    />
                  </div>
                ))}
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>

      <Navbar
        isLogged={
          auth.role === "guest" ||
          auth.role === "clerk" ||
          auth.role === "admin"
        }
      />
      <Routes>
        <Route path="/" element={<Dashboard socket={socket} auth={auth} />} />
        <Route path="/login" element={<Login auth={auth} />} />
        <Route path="/scan" element={<Scan />} />
        <Route
          path="/scan/:table_id"
          element={<TableComponent socket={socket} />}
        />
      </Routes>
    </>
  );
};

export default Main;
export { setModalFunction as setModal };
