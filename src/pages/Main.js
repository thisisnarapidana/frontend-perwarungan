import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
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
  const authenticationResponse = useAuthentication();

  const [tableNo, setTableNo] = useState("");
  const location = useLocation();
  let [auth, setAuth] = useState({ success: false, user_id: "", role: "" });

  useEffect(() => {   
      if (authenticationResponse && authenticationResponse.success) 
        setAuth(authenticationResponse);
      
  }, [authenticationResponse]);

  useEffect(() => {
    if (!location.pathname.startsWith("/scan/")) {
      setTableNo("");
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar
        isLogged={
          auth.role === "guest" ||
          auth.role === "clerk" ||
          auth.role === "admin"
        }
        tableNo={tableNo}
      />
      <Routes>
        <Route path="/" element={<Dashboard auth={auth} />} />
        <Route path="/login" element={<Login auth={auth} />} />
        <Route path="/scan" element={<Scan />} />
        <Route
          path="/scan/:table_id"
          element={<TableComponent setTable={setTableNo} />}
        />
      </Routes>
    </>
  );
};

export default Main;
