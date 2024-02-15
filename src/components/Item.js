import React, { useState, useEffect } from "react";
import "./styling/Item.css";
import "../tombol.css";

const Item = ({
  item,
  apiUrl,
  startqty,
  listed,
  onEdit, // for qty changing

  //below is for admin and clerk
  role,
  forDisplay,

  //below is for admin
  beingEdited,
  cancel,
  onItemEdit,
  deleteItem,
  onSaveItem,

  //below is for clerk
  transactionFollowUp,
  clerkJobHandler,
}) => {
  const [qty, setQty] = useState(startqty);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    qty: "",
    image: null, // New state to hold the image file
  });

  const [imagePreview, setImagePreview] = useState(
    apiUrl + "/" + item.image_url,
  );

  useEffect(() => {
    setFormData({
      name: item.name,
      price: item.price,
      qty: item.startQty,
    });
  }, [item]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldChange = (event, field) => {
    let name = event.target.name;
    let value = event.target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveItem = () => {
    onSaveItem(formData);
  };

  // useEffect(() => {
  // set();
  // navigator.geolocation.getCurrentPosition(function(position) {
  //     const latitude = position.coords.latitude;
  //     const longitude = position.coords.longitude;
  //     console.log('Latitude:', latitude);
  //     console.log('Longitude:', longitude);
  //     const accuracy = position.coords.accuracy;
  //     sss(latitude + " " + longitude + " " + accuracy);
  // }, function(error) {
  //     console.error('Error getting geolocation:', error);
  // });
  // }, []);

  const cancelHandler = () => {
    setQty(0);
    cancel();
  };

  const decreaseQty = () => {
    if (qty > 0) {
      setQty(qty - 1);
      onEdit(qty - 1);
    }
    if (qty === 1) cancel();
  };

  const increaseQty = () => {
    setQty(qty + 1);
    onEdit(qty + 1);
  };

  const handleEditClick = (t) => {
    if (role === "admin") {
      onItemEdit(t);
    }
  };

  return (
    <div className="quadrant-container">
      <div className="top-left">
        <input
          disabled={!beingEdited}
          className={!beingEdited ? "name transparent" : "name"}
          name="name"
          type="text"
          value={formData.name}
          onChange={(e) => handleFieldChange(e)}
        />
        <input
          disabled={!beingEdited}
          className={!beingEdited ? "price transparent" : "price"}
          name="price"
          type="text"
          value={formData.price}
          onChange={(e) => handleFieldChange(e)}
        />
      </div>
      <div className="top-right">
        <div className="container">
          <div className="image-container">
            <img src={imagePreview} alt="Your Image" className="image" />
            {role === "admin" && beingEdited && (
              <label htmlFor="file-upload" className="custom-file-upload">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="input-file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div className="centered-button"></div>
                <button
                  style={{ pointerEvents: "none" }}
                  className="centered-button"
                >
                  +
                </button>
              </label>
            )}
          </div>
        </div>
      </div>
      <div className="bottom-left">
        <div>
          <button className="tombol" onClick={decreaseQty}>
            -
          </button>
        </div>
        <div>
          <div className="tombol">{qty}</div>
        </div>
        <div>
          <button className="tombol" onClick={increaseQty}>
            +
          </button>
        </div>
      </div>
      <div className="bottom-right">
        {role === "admin" ? (
          <div>
            <button className="tombol" onClick={deleteItem}>
              hapus
            </button>
            {beingEdited ? (
              <div>
                <button
                  className="tombol"
                  onClick={() => handleEditClick(false)}
                >
                  Batal
                </button>
                <button className="tombol" onClick={handleSaveItem}>
                  Simpan
                </button>
              </div>
            ) : (
              <button className="tombol" onClick={() => handleEditClick(true)}>
                Edit
              </button>
            )}
          </div>
        ) : role === "clerk" ? (
          <div>
            <button className="tombol" onClick={clerkJobHandler}>
              {forDisplay === "listpesanan" ? transactionFollowUp : "Tambahkan"}
            </button>
          </div>
        ) : (
          <div>
            {!listed ? (
              <button className="tombol" onClick={increaseQty}>
                Tambahkan
              </button>
            ) : (
              <button className="tombol" onClick={cancelHandler}>
                Batalkan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
