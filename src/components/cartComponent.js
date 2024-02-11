import React, { useState, useEffect } from "react";
import { firstScan } from "../userCaller.js";
import "./styling/Fade.css"; // Assuming you have a CSS file for your styles
import { Checkout } from "../transactionCaller";
import { Link } from "react-router-dom";
import "../tombol.css";

const Cart = ({ price, children, isOpen }) => {
  const [cartHeight, setCartHeight] = useState(0);
  const [started, start] = useState(false);
  const [logged, setLog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set the height of the cart to match its content
      const cartContentHeight =
        document.getElementById("cart-content").scrollHeight;
      setCartHeight(cartContentHeight);
      cekMeja();
    }
    setTimeout(function () {
      //Start the timer
      start(true);
    }, 3000);
  }, [isOpen]);

  const cekMeja = async () => {
    const url = new URL(window.location);
    const path = url.pathname;

    const parameters = path.split("/");

    const scan = parameters[1];
    if (scan === "scan") setLog(true);
  };

  const CheckOut = async () => {
    try {
      if (localStorage.getItem("session_id") === null) {
        try {
          await firstScan();
        } catch (error) {}
      }

      const url = new URL(window.location);
      const path = url.pathname;

      const parameters = path.split("/");

      const table_id = parameters[2];

      const checkoutResponse = await Checkout(table_id);
      console.log("Checkout Response:", checkoutResponse);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div
      style={{ visibility: started ? "visible" : "hidden" }}
      className={`cart ${isOpen ? "fade-in-bottom" : "fade-out-bottom"}`}
    >
      <div
        className="cart-content"
        id="cart-content"
        style={{ height: cartHeight }}
      >
        {children}
      </div>

      <div
        style={{
          backgroundColor: "white",
          position: "fixed",
          bottom: "7%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "100px",
        }}
      >
        <h1 style={{ minWidth: "50%", textAlign: "center", margin: 0 }}>
          {price}
        </h1>
        <div
          style={{
            maxWidth: "50%",
            height: "50%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {logged === false ? (
            <Link
              style={{ textDecoration: "none" }}
              to="/scan"
              className="tombol"
            >
              scan meja
            </Link>
          ) : (
            <button
              style={{ textDecoration: "none" }}
              onClick={CheckOut}
              className="tombol"
            >
              checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
