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
  onUpload,

  //below is for clerk
  transactionFollowUp,
  clerkJobHandler,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cogs: "",
    qty: 0,
    image: null,
  });

  const [imagePreview, setImagePreview] = useState();

  useEffect(() => {
    if (item) {
      if (typeof item !== "undefined")
        setImagePreview(apiUrl + "/" + item.image_url);

      let name = "";
      if (forDisplay === "listpesanan") name = startqty + "x " + item.name;
      else name = item.name;

      setFormData({
        name: name,
        price: item.price,
        cogs: item.cogs,
        qty: role === "admin" ? startqty || item.qty : startqty,
      });
    }
  }, [item]);

  const handleFileChange = (event) => {
    if (item === null) return;
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
    setFormData({
      qty: 0,
    });

    //function work on cart
    if (!beingEdited) cancel();
  };

  const decreaseQty = () => {
    if (formData.qty > 0) {
      setFormData({
        qty: formData.qty - 1,
      });

      //function work on cart
      if (!beingEdited) onEdit(formData.qty - 1);
    }
    if (formData.qty === 1) cancel();
  };

  const increaseQty = () => {
    setFormData({
      qty: formData.qty + 1,
    });

    //function work on cart
    if (!beingEdited) onEdit(formData.qty + 1);
  };

  const handleEditClick = (t) => {
    if (role === "admin") {
      onItemEdit(t);
    }
  };

  const followUpText = (role, status) => {
    if (role === "guest") {
      if (status === "11") return "Menunggu diproses";
      else if (status === "22") return "Sedang diproses";
      else if (status === "33") return "Selesai";
      else if (status === "43") return "Dibatalkan";
    } else if (role === "clerk") {
      if (status === "11") return "Proses pesanan";
      else if (status === "22") return "Selesaikan pesanan";
      else if (status === "33") return "Selesai";
      else if (status === "43") return "Dibatalkan";
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
          placeholder="nama"
          onChange={(e) => handleFieldChange(e)}
        />
        <input
          disabled={!beingEdited}
          className={!beingEdited ? "price transparent" : "price"}
          name="price"
          type="text"
          value={formData.price}
          placeholder="harga"
          onChange={(e) => handleFieldChange(e)}
        />
        {role === "admin" && (
          <input
            disabled={!beingEdited}
            className={!beingEdited ? "price transparent" : "price"}
            name="cogs"
            type="text"
            value={formData.cogs}
            placeholder="Biaya produksi"
            onChange={(e) => handleFieldChange(e)}
          />
        )}
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
      {forDisplay === "listpesanan" ? (
        transactionFollowUp === 11 && (
          <div className="bottom-left">
            <div>
              <button className="tombol" onClick={decreaseQty}>
                batalkan
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="bottom-left">
          {role === "admin" ? (
            beingEdited ? (
              <>
                <div>
                  <button className="tombol" onClick={decreaseQty}>
                    -
                  </button>
                </div>
                <div>
                  <div className="tombol">{formData.qty}</div>
                </div>
                <div>
                  <button className="tombol" onClick={increaseQty}>
                    +
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="tombol">kuantitas {item.qty}</div>
              </div>
            )
          ) : (
            <>
              <div>
                <button className="tombol" onClick={decreaseQty}>
                  -
                </button>
              </div>
              <div>
                <div className="tombol">{formData.qty}</div>
              </div>
              <div>
                <button className="tombol" onClick={increaseQty}>
                  +
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="bottom-right">
        {role === "admin" ? (
          <>
            {beingEdited ? (
              <>
                <button
                  className="tombol"
                  onClick={() => handleEditClick(false)}
                >
                  Batal
                </button>
                <button className="tombol" onClick={handleSaveItem}>
                  Simpan
                </button>
              </>
            ) : (
              <>
                <button
                  className="tombol"
                  onClick={() => handleEditClick(true)}
                >
                  Edit
                </button>
                <button className="tombol" onClick={deleteItem}>
                  hapus
                </button>
              </>
            )}
          </>
        ) : role === "clerk" ? (
          <div>
            <button className="tombol" onClick={clerkJobHandler}>
              {forDisplay === "listpesanan"
                ? followUpText(role, transactionFollowUp)
                : "Tambahkan"}
            </button>
          </div>
        ) : role === "guest" ? (
          <>
            {transactionFollowUp === 11 && (
              <button className="tombol" onClick={clerkJobHandler}>
                {forDisplay === "listpesanan"
                  ? followUpText(role, transactionFollowUp)
                  : "Tambahkan"}
              </button>
            )}
            <button className="tombol" onClick={clerkJobHandler}>
              {forDisplay === "listpesanan"
                ? followUpText(role, transactionFollowUp)
                : "Tambahkan"}
            </button>
          </>
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
