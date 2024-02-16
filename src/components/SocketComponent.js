import { useState, useEffect } from "react";
import io from "socket.io-client";
import { setModal } from "../pages/Main";

function useSocket() {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const newSocket = io("https://phchw7-1946.csb.app/");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
    });

    newSocket.on("followUp", () => {
      setModal();
      console.log("followUp received");
    });

    newSocket.on("transaction", () => {
      setModal();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Expose a function to get the socketId
  const getSocketId = () => {
    return socketId;
  };

  return { socket, getSocketId }; // Return both socket and getSocketId function
}

export default useSocket;
