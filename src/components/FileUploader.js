import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function FileUploader() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    cogs: "",
    qty: 0,
    image: null,
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: file,
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const apiUrl = "https://phchw7-1946.csb.app";
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("cogs", formData.cogs);
      formDataToSend.append("qty", formData.qty);
      formDataToSend.append("image", formData.image);

      const response = await fetch(apiUrl + "/item", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("session_id"),
        },
        body: formDataToSend,
      });
      const data = await response.json();
      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Open Modal
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter price"
                name="price"
                value={formData.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formCogs">
              <Form.Label>COGS</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter COGS"
                name="cogs"
                value={formData.cogs}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formQty">
              <Form.Label>QTY</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter QTY"
                name="qty"
                value={formData.qty}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="formImage">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default FileUploader;
