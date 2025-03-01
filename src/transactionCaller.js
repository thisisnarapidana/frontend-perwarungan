import { useEffect } from "react";
import apiUrl from "./apiConfig";

export const Checkout = async (table_id, payment_type) => {
  try {
    const cardItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const formattedItems = cardItems.map((item) => [item.item_id, item.qty]);

    const response = await fetch(apiUrl + "/transaction/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
      body: JSON.stringify({
        table_id: table_id,
        items: formattedItems,
        payment_type: payment_type,
      }),
    });

    if (!response.ok) {
      console.error("Checkout failed. Status:", response.status);
      return { success: false, message: "Checkout failed. Please try again." };
    }

    const data = await response.json();
    return { success: true, data };
    
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again.",
    };
  }
};

export const getMyTransactions = async () => {
  try {
    const response = await fetch(apiUrl + "/transaction/mytransactions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
    });

    if (!response.ok) {
      console.error(
        "get list of transactions failed. Status:",
        response.status,
      );
      return {
        success: false,
        message: "get list of transactions failed. Please try again.",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again.",
    };
  }
};

export const getTransactionInProcess = async () => {
  try {
    const response = await fetch(apiUrl + "/transaction/process", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
    });

    if (!response.ok) {
      console.error("get process failed. Status:", response.status);
      return {
        success: false,
        message: "get process failed. Please try again.",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again.",
    };
  }
};

export const setClerkFollowUp = async (detailed_transaction_id) => {
  try {
    const response = await fetch(apiUrl + "/transaction/process", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
      body: JSON.stringify({
        detailed_transaction_id: detailed_transaction_id,
      }),
    });

    if (!response.ok) {
      console.error("update followUp failed. Status:", response.status);
      return {
        success: false,
        message: "update followUp failed. Please try again.",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again.",
    };
  }
};

export const Kulakan = ({ setItems, setLoading }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl + "/item/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("session_id"),
          },
        });
        const data = await response.json();
        setItems(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching catalog data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [setItems, setLoading]);

  return null;
};

export const retrieveSpecificTransaction = async (transaction_id) => {
  console.log(transaction_id);
  try {
    const response = await fetch(apiUrl + "/transaction/" + transaction_id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
    });

    if (!response.ok) {
      console.error("get transaction failed. Status:", response.status);
      return {
        success: false,
        message: "get process failed. Please try again.",
      };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error during checkout:", error);
    return {
      success: false,
      message: "An error occurred during checkout. Please try again.",
    };
  }
};