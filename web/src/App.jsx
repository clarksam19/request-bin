import Requests from "./components/Requests";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";

import getRequests from "./services/requestService";

function App() {
  const [requests, setRequests] = useState("");
  useEffect(() => {
    setRequests("");
  }, []);

  const socket = io();

  socket.on("connect", () => {
    console.log("connected:", socket.id);
  });

  socket.on("ping", (arg) => {
    console.log(arg);
  });

  socket.on("update", async (url) => {
    const newRequests = await getRequests(url);
    setRequests(JSON.stringify(newRequests));
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });
  return (
    <div>
      <h1>Request Bin</h1>
      <Requests requests={requests} />
    </div>
  );
}

export default App;
