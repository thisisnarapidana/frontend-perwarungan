import React from 'react';
import { Link } from 'react-router-dom';
import { logout } from './userCaller.js';
import './tombol.css';
const Navbar = ({isLogged, tableNo}) => {
  const handleLogout = () => {
    logout();
    localStorage.removeItem("session_id");
    window.location.reload(false);
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Kebangsaan</Link>
        <Link style={{textDecoration: 'none'}} to="/scan" className='tombol'>scan meja </Link>
          {tableNo == "" ? (
            <div>
              {isLogged ?
              <Link className="navbar-brand" style={{textDecoration: 'none'}} onClick={handleLogout}>logout</Link>
              :
              <Link className="navbar-brand" style={{textDecoration: 'none'}} to="/login">login</Link>
              }
              </div>
          ) : (
            <div className='tombol'>dikirim ke meja no {tableNo} </div>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
