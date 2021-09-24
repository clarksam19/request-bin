import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import "./index.css";

import { getRequests, getUrl } from "./services/requestService";

function App() {
  const [requests, setRequests] = useState([]);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setRequests([]);
  }, []);

  const socket = io();

  socket.on("connect", () => {
    console.log("connected:", socket.id);
  });

  socket.on("update", async (url) => {
    const newRequests = await getRequests(url);
    const result = newRequests.map((req) => JSON.stringify(req));
    setRequests(result);
  });

  socket.on("disconnect", () => {
    console.log("disconnected:", socket.id);
  });

  const handleClick = async () => {
    const newUrl = await getUrl();
    setUrl(newUrl);
  };

  return (
    <div>
      <h1 class="text-center text-5xl font-bold">Request Bin</h1>
      <div class="grid grid-cols-3 gap-2 ">
        <button
          class="border-solid border-4 bg-blue-100"
          onClick={() => handleClick()}
        >
          Get URL
        </button>
        <input
          type="text"
          placeholder="Request Bin URL"
          value={url}
          readOnly={true}
        />
      </div>
      <div>
        {requests.map((req, idx) => {
          req = JSON.parse(req);
          return (
            <ul>
              <li>{`Request ${idx + 1}`}</li>
              <li>Headers</li>
              {Object.entries(req.headers).map((entry) => {
                return <li>{`${entry[0]}: ${entry[1]}`}</li>;
              })}
              <li>Body</li>
              {Object.entries(req.body).map((entry) => {
                return (
                  <li>
                    <pre>{`${entry[0]}: ${JSON.stringify(
                      entry[1],
                      null,
                      2
                    )}`}</pre>
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
    </div>
  );
}

export default App;
