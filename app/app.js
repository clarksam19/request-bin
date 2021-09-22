const express = require("express");
const http = require("http");
const socket = require("socket.io");
const db = require("./db/queries");
const PORT = 3000;

const Pool = require("pg").Pool;
const DB_PORT = 5432;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "request_bin",
  password: "motdepasse",
  port: DB_PORT,
});

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("../web/build"));

app.get("/api", db.getRequests);
app.post("/", (req, res) => {
  const url = req.headers.host;
  const headers = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);
  pool
    .query(
      "INSERT INTO requests (url, headers, body) VALUES ($1, $2, $3) RETURNING (headers)",
      [url, headers, body]
    )
    .then((result) => {
      const url = result.rows[0].headers.host;
      res.status(200).json(url);
      io.emit("update", url);
    })
    .catch((err) => console.log(err.stack));
});

io.on("connection", () => {
  console.log("connected");
  io.emit("ping", "pong");
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});
