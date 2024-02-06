import React, { useState, useEffect } from 'react';
import './styling/Fade.css'; // Assuming you have a CSS file for your styles
import { Checkout } from '../transactionCaller';
import { Link } from 'react-router-dom';
const Cart = ({ price, children, isOpen }) => {
  const [cartHeight, setCartHeight] = useState(0);
  const [started, start] = useState(false);
  const [logged, setLog] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Set the height of the cart to match its content
      const cartContentHeight = document.getElementById('cart-content').scrollHeight;
      setCartHeight(cartContentHeight);
      cekMeja();
    }
    setTimeout(function () { //Start the timer
      start(true);
    }.bind(this), 3000)
  }, [isOpen]);

  const cekMeja = async () => {
    const url = new URL(window.location);
    const path = url.pathname;

    const parameters = path.split('/');

    const scan = parameters[1];
    if (scan === 'scan') setLog(true);
  };

  const CheckOut = async () => {
    try {
      const checkoutResponse = await Checkout();
      console.log('Checkout Response:', checkoutResponse);
      // You can handle the checkout response here
    } catch (error) {
      console.error('Error during checkout:', error);
      // Handle the error if needed
    }
  };

  return (
    <div style={{ visibility: started ? 'visible' : 'hidden' }} className={`cart ${isOpen ? 'fade-in-bottom' : 'fade-out-bottom'}`}>
      <div className="cart-content" id="cart-content" style={{ height: cartHeight }}>
        {children}
      </div>

      <div style={{ backgroundColor: 'white', position: 'fixed', bottom: '7%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: '100px' }}>
        <h1 style={{ minWidth: '50%', textAlign: 'center', margin: 0 }}>{price}</h1>
        <div style={{ maxWidth: '50%', height: '100%', display: 'flex', justifyContent: 'space-between' }}>
          {logged === false && (
            <Link to="/scan"><button><img style={{width: '100%', height: '100%'}} src='/scanqr.png' /></button></Link>
          )}
          <button style={{ width: '100%' }} onClick={CheckOut}>CheckOut</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
