import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { firstScan } from "../userCaller.js";
import "./styling/Fade.css"; // Assuming you have a CSS file for your styles
import { Checkout, retrieveSpecificTransaction } from "../transactionCaller";
import { Link } from "react-router-dom";
import "../tombol.css";
import { setModal } from "../pages/Main.js";

const Cart = ({ price, children, isOpen }) => {
  const navigate = useNavigate();
  const [cartHeight, setCartHeight] = useState(0);
  const [started, start] = useState(false);
  const [logged, setLog] = useState(false);
  const [isTakeaway, setIsTakeaway] = useState(false);
  const [paymentType, setPaymentType] = useState("");

  useEffect(() => {
    // isOpen is true when the cart is open
    if (isOpen) {
      // Set the height of the cart to match its content
      const cartContentHeight =
        document.getElementById("cart-content").scrollHeight;
      setCartHeight(cartContentHeight);
      cekMeja();
    }

    const fetchData = async () => {
      const params = new URLSearchParams(window.location.search);
  
      if(params.has('transaction_status')) {
        const orderId = params.get('order_id');
  
        const gettransaction = await retrieveSpecificTransaction(orderId);
        if(gettransaction.success) {
          window.location.href = window.location.protocol + "//" + window.location.host + "/scan/" + gettransaction.data.table_id + "/#checkout";
        }
      }
      
      if(window.location.hash === '#checkout'){
        setModal();
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    };
  
    fetchData();

    setTimeout(function () {      
      //Start the timer, this prevent animation fadeout on after loading the page
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
          if(paymentType === 'cash') window.location.href = window.location + "/#checkout";
        } catch (error) {}
      }

      const url = new URL(window.location);
      const path = url.pathname;

      const parameters = path.split("/");

      const table_id = parameters[2];

      const checkoutResponse = await Checkout(table_id, paymentType);

      if (checkoutResponse.success){
        if(paymentType === 'cash') setModal();
        else if(paymentType === 'emoney') window.location.href = checkoutResponse.data.emoneyRedirectUrl + "#/gopay-finish-deeplink";
      }
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
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >

<div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h1 style={{ margin: 0, marginBottom: "10px" }}>{price}</h1>
            <div style={{ margin: 0 }}>
                {logged === false ? (
              <select className="tombol" name="cars" id="cars" onChange={(e) => setIsTakeaway(e.target.value)}>
                <option value="" disabled selected hidden>
                  Makan ditempat ?
                </option>
                <option value="y">benar</option>
                <option value="n">salah</option>
              </select>
                ) : (
                  <select className="tombol roundedEdge" name="cars" id="cars" onChange={(e) => setPaymentType(e.target.value)}>
                    <option value="" disabled selected hidden>
                      Tipe pembayaran?
                    </option>
                    <option value="cash">Cash</option>
                    <option value="emoney">EMoney</option>
                  </select>
                )}
            </div>
          </div>
        </div>

          {logged === false ? (
            <Link
              style={{ textDecoration: "none" }}
              to="/scan"
              className="tombol roundedEdge"
            >
              scan meja
            </Link>
          ) : (
            <button
              style={{ textDecoration: "none" }}
              onClick={CheckOut}
              className="tombol"
            >
              Checkout
            </button>
          )}
      </div>
    </div>
  );
};

export default Cart;
