import { useState, useEffect } from "react";
import io from "socket.io-client";
import { setModal } from "../Dashboard";

function useSocket() {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    const newSocket = io("https://phchw7-1946.csb.app/");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
    });

    newSocket.on("transaction", ({ table_id, transaction_id }) => {
      console.log("tr");
      setModal(transaction_id);
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
