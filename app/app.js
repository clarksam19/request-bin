const express = require("express");
const http = require("http");
const socket = require("socket.io");
const db = require("./db/queries");
const ngrok = require("ngrok");
const config = require("./utils/config");

const Pool = require("pg").Pool;

const pool = new Pool({
  user: config.PG_USER,
  host: config.PG_HOST,
  database: config.PG_DB,
  password: config.PG_PASS,
  port: config.PG_PORT,
});

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("../web/build"));

app.get("/ngrok", async (req, res) => {
  const url = await ngrok.connect(config.PORT);
  res.send(url);
});
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
  io.emit("ping", "pong");
});

server.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}...`);
});
