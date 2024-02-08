import { useState, useEffect } from "react";
import io from "socket.io-client";

function useSocket() {
  const [socket, setSocket] = useState(null);
  const [socketId, setSocketId] = useState(null); // New state for socket id

  useEffect(() => {
    const newSocket = io("https://j6n9dh-1946.csb.app");
    setSocket(newSocket);

    // Set up event listener to get the socket id once connected
    newSocket.on("connect", () => {
      setSocketId(newSocket.id);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket, socketId }; // Return both socket and socketId as an object
}

export default useSocket;
