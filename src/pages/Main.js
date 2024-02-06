import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { isAuthenticated, firstScan } from '../userCaller.js';
import Navbar from '../Navbar';
import Dashboard from '../Dashboard';
import Login from './Login';
import Scan from './Scan';
import TableComponent from './TableComponent';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const Main = () => {
  return (
    <Router>
      <MainRoutes />
    </Router>
  );
};

const MainRoutes = () => {
  const [tableNo, setTableNo] = useState("");
  const location = useLocation();

  let [auth, setAuth] = useState({ "success": false, "role": "" });
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await isAuthenticated();
        setAuth(response);
      } catch (error) {
        console.log("gagal login");

        // try {
        //   const firstime = await firstScan();
        //   console.log("berhasil");
        //   checkAuth();
        // } catch (error) {

        // }
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!location.pathname.startsWith("/scan/")) {
      setTableNo(""); // reset, karena tidak dalam meja
    }
  }, [location.pathname]);

  return (
    <>
      <Navbar isLogged={auth.role === 'guest' || auth.role === 'clerk' || auth.role === 'admin'} tableNo={tableNo} />
      <Routes>
        <Route path="/" element={<Dashboard auth = {auth}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/scan" element={<Scan />} />
        <Route path="/scan/:table_id" element={<TableComponent setTable={setTableNo} />} />
      </Routes>
    </>
  );
};

export default Main;