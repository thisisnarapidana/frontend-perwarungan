import React from "react";
import "./OrderanComponent.css";

function OrderanComponent({showModal, toggleModal}) {
  return (
    <div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Modal header */}
            <div className="modal-header">
              <h2></h2>
              {/* Button to close the modal */}
              <button onClick={toggleModal}>Close</button>
            </div>
            {/* Modal body */}
            <div className="modal-body"></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderanComponent;
