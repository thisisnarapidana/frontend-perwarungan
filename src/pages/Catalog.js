import React, { useState, useEffect } from "react";
import apiUrl from "../apiConfig";
import "./styling/Catalog.css";

import FileUploader from "../components/FileUploader";
import Item from "../components/Item";

import Cart from "../components/cartComponent";

import { GetAll, Delete } from "../itemCaller";
import { Link } from "react-router-dom";
import { setModal } from "../Dashboard";

const Catalog = ({ rolee, tableNo }) => {
  const no_table = tableNo || "";
  const role = rolee || "";
  const [items, setItems] = useState([]);
  const [tempitems, setTempItems] = useState([]);

  const [cartItems, setCartItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState({});
  const [tempFilteredItems, setTempFilteredItems] = useState({});

  const [loading, setLoading] = useState(true);

  const [isCartOpen, setCartOpen] = useState(false);

  const [editedItemId, setEditedItemId] = useState(null);

  useEffect(() => {
    set();
    filterItems();
    setTempItems(items);
    setTempFilteredItems(filteredItems);

    if (!loading) {
      let updatedCartItems = cartItems.filter((cartItem) => {
        return items.some((items) => items.item_id === cartItem.item_id);
      });

      // Update localStorage with the filtered cart items
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    }
  }, [items]);

  useEffect(() => {
    filterItems();
  }, [cartItems]);

  const filterItems = () => {
    const filtered = items.filter((item) => {
      // Return true if the item_id exists in cartItems
      return cartItems.some((cartItem) => cartItem.item_id === item.item_id);
    });
    setFilteredItems(filtered);
  };

  const handleCart = async () => {
    filterItems();
    setCartOpen((prevState) => !prevState);
    document.body.style.overflow = isCartOpen ? "auto" : "hidden";

    if (!isCartOpen) {
      setTempFilteredItems(filteredItems);

      const delayedEmptyResult = await delayedEmpty();
      setTempItems(delayedEmptyResult);
    } else {
      setTempItems(items);

      const delayedEmptyResult = await delayedEmpty();
      setTempFilteredItems(delayedEmptyResult);
    }
  };
  // to delay the nulling temp, so it looks good, the temp must be null to refresh keep updating with cart
  const delayedEmpty = () =>
    new Promise((resolve) => setTimeout(() => resolve([]), 500));

  const getStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("cartItems")) || [];
    } catch {
      localStorage.removeItem("cartItems");
      window.location.reload();
    }
  };
  const set = () => {
    const tempcart = getStorage();
    setCartItems(tempcart);

    // if (getTotalPrice().toString() === "NaN") localStorage.removeItem("cartItems");
    // if (getLength() < 2) setCartOpen(false);
  };

  const addToCart = (item_id, price, qty) => {
    const updatedCartItems = [...cartItems, { item_id, price, qty }];
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    set();
  };

  const deleteFromCart = (item_id) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.item_id !== item_id,
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

    set();
  };

  const handleEdit = (item_id, price, qty) => {
    // Find the index of the item to be edited in cartItems
    const itemIndex = cartItems.findIndex((item) => item.item_id === item_id);

    if (itemIndex !== -1) {
      // Create a copy of the current cartItems array
      const updatedCartItems = [...cartItems];

      // Update the quantity of the item at the specified index
      updatedCartItems[itemIndex].qty = qty;

      // Update the cartItems state with the new array
      setCartItems(updatedCartItems);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));

      set();
    } else {
      // If the item is not found in the cart, add it
      addToCart(item_id, price, qty);
    }
  };

  const getLength = () => {
    let tempcart = getStorage();
    if (tempcart.length > 0) return "+" + tempcart.length;
    else return "";
  };

  const getItemById = (item_id) => {
    let tempcart = getStorage();
    const index = tempcart.findIndex((item) => item.item_id === item_id);
    if (index !== -1) {
      return tempcart.find((item) => item.item_id === item_id).qty;
    }
    return 0;
  };

  const checkItem = (item_id) => {
    return cartItems.some((cartItem) => cartItem.item_id === item_id);
  };

  // const getItemPrice = (id) => {
  //     let tempcart = JSON.parse(localStorage.getItem('cartItems')) || [];
  //     const item = tempcart.find(item => item.id === id);
  //     return item ? item.price : 0;
  // };

  const getTotalPrice = () => {
    let tempcart = getStorage();
    const res = tempcart.reduce(
      (total, item) => total + item.price * item.qty,
      0,
    );
    if (res > 0) return new Intl.NumberFormat("en-DE").format(res);
    else return "";
  };

  const handleItemEdit = (item_id, e) => {
    if (e)
      setEditedItemId(item_id); // true means edit, false means cancel
    else setEditedItemId("");
  };

  const handleSaveItem = (item_id, formData) => {
    // Here you can perform the logic to save the item, including sending
    // the form data (including the image file) to the backend
    console.log(formData); // Just for demonstration
  };

  const handleItemDelete = (item_id) => {
    console.log(item_id);
    Delete(item_id);
  };

  return (
    <div>
      <h1
        style={{ display: loading ? "" : "none" }}
        className="loading-message"
      >
        Loading...
      </h1>
      <div style={{ display: loading ? "none" : "" }}>
        {rolee !== "clerk" && rolee !== "admin" && (
          <div>
            <Cart price={getTotalPrice()} isOpen={isCartOpen}>
              {tempFilteredItems.length > 0 ? (
                <div>
                  {tempFilteredItems.map((item) => (
                    <div key={item.item_id} className="rectangle border">
                      <Item
                        item={item}
                        apiUrl={apiUrl}
                        startqty={getItemById(item.item_id)}
                        role={role}
                        onEdit={(qty) =>
                          handleEdit(item.item_id, item.price, qty)
                        }
                        onSaveItem={handleSaveItem}
                        cancel={() => deleteFromCart(item.item_id)}
                        listed={checkItem(item.item_id)}
                      />
                    </div>
                  ))}

                  <div className="rectangle"></div>
                </div>
              ) : (
                <h1 className="no-products-message">Tidak ada produk</h1>
              )}
            </Cart>

            {cartItems.length > 0 && (
              <div
                style={{
                  zIndex: "999",
                  position: "fixed",
                  bottom: "-1%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  textAlign: "center",
                }}
              >
                <button
                  type="button"
                  onClick={handleCart}
                  className="tombolbgrnd"
                >
                  {!isCartOpen &&
                    (no_table === "" ? (
                      <Link
                        style={{ textDecoration: "none" }}
                        to="/scan"
                        className="tombol"
                      >
                        scan meja
                      </Link>
                    ) : (
                      <div className="tombol">dikirim ke meja no {tableNo}</div>
                    ))}
                  &nbsp;
                  {!isCartOpen ? `Keranjang ${getLength()}` : "Tutup"}
                </button>
              </div>
            )}
          </div>
        )}
        {rolee === "clerk" && (
          <div>
            <div
              style={{
                zIndex: "999",
                position: "fixed",
                bottom: "-1%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setModal()}
                className="tombolbgrnd"
              >
                Pesanann
              </button>
            </div>
          </div>
        )}

        {rolee === "clerk" || (rolee === "admin" && <FileUploader />)}
        <div>
          <div className="catalog-kontener">
            <GetAll setItems={setItems} setLoading={setLoading} />
            <div className="kontener">
              {rolee === "admin" && (
                <div
                  className="rectangle border"
                  style={{ position: "relative" }}
                >
                  <h4
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      margin: "0", // Remove default margin
                    }}
                  >
                    +
                  </h4>
                </div>
              )}
              {tempitems.length > 0 ? (
                <>
                  {tempitems.map((item) => (
                    <div key={item.item_id} className="rectangle border">
                      <Item
                        item={item}
                        apiUrl={apiUrl}
                        startqty={getItemById(item.item_id)}
                        listed={checkItem(item.item_id)}
                        onEdit={(qty) =>
                          handleEdit(item.item_id, item.price, qty)
                        }
                        // below is for admin and clerk
                        role={role}
                        // below is for admin
                        beingEdited={editedItemId === item.item_id}
                        cancel={() => deleteFromCart(item.item_id)}
                        onItemEdit={(e) => handleItemEdit(item.item_id, e)}
                        deleteItem={() => handleItemDelete(item.item_id)}
                        onSaveItem={(e) => handleSaveItem(item.item_id, e)}
                      />
                    </div>
                  ))}
                  <div className="rectangle"></div>
                </>
              ) : (
                <h1 className="no-products-message">Tidak ada produk</h1>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalog;
