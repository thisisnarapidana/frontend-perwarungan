import { useEffect, useState } from "react";
import apiUrl from "./apiConfig";
import useSocket from "./components/SocketComponent";

export const useAuthentication = () => {
  const { getSocketId } = useSocket();
  const socketId = getSocketId();
  const [response, setResponse] = useState(null);

  useEffect(() => {
    console.log("Inside useAuthentication useEffect");
    const fetchAuthenticationStatus = async () => {
      console.log("Current socketId:", socketId);

      try {
        console.log("checking");
        const res = await fetch(apiUrl + "/users/signcheck", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("session_id"),
          },
          body: JSON.stringify({
            socketId: socketId,
          }),
        });
        const data = await res.json();
        if (!data.success) localStorage.removeItem("session_id");
        setResponse(data);
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    fetchAuthenticationStatus();
  }, [socketId]);

  return response;
};

export const firstScan = async () => {
  try {
    const response = await fetch(apiUrl + "/users/firstscan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    localStorage.setItem("session_id", data.session_id);
  } catch (error) {}
};

export const update = async () => {
  try {
    const response = await fetch(apiUrl + "/users/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  } catch (error) {
    return false;
  }
};

export const logout = async () => {
  try {
    const response = await fetch(apiUrl + "/users/signout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("session_id"),
      },
    });

    return await response.json();
  } catch (error) {
    return false;
  }
};
