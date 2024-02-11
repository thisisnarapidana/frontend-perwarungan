import React, { useState, useEffect } from "react";
import useSocket from "../components/SocketComponent";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useAuthentication } from "../userCaller.js";
import Navbar from "../Navbar";
import Dashboard from "../Dashboard";
import Login from "./Login";
import Scan from "./Scan";
import TableComponent from "./TableComponent";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

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
