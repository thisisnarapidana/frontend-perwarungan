import { useEffect } from "react";
import apiUrl from "./apiConfig";

export const Post = async (formData) => {
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
  } catch (error) {
    console.error("Error:", error);
  }
};

export const Update = async (item_id, formData) => {
  try {
    const apiUrl = "https://phchw7-1946.csb.app";
    const formDataToSend = new FormData();
    formDataToSend.append("item_id", item_id);
    formDataToSend.append("name", formData.name);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("cogs", formData.cogs);
    formDataToSend.append("qty", formData.qty);
    formDataToSend.append("image", formData.image);

    const response = await fetch(apiUrl + "/item", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
      body: formDataToSend,
    });
  } catch (error) {
    console.error("Error:", error);
  }
};

export const GetAll = ({ setItems, setLoading }) => {
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

export const Get = ({ setItems, setLoading }) => {
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

export const Delete = async (item_id) => {
  console.log("id" + item_id);
  try {
    const response = await fetch(apiUrl + "/item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
      body: JSON.stringify({
        item_id: item_id,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching catalog data:", error);
    return false;
  }
};
