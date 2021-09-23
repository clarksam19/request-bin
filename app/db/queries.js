const Pool = require("pg").Pool;
const PORT = 5432;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "request_bin",
  password: "motdepasse",
  port: PORT,
});

const getRequests = (req, res) => {
  pool.query(
    "SELECT * FROM requests WHERE url = $1",
    [req.query.url],
    (err, results) => {
      if (err) {
        throw err;
      }

      res.status(200).json(results.rows);
    }
  );
};

const addRequest = (req, res) => {
  const url = req.headers.host;
  const headers = JSON.stringify(req.headers);
  const body = JSON.stringify(req.body);
  pool
    .query(
      "INSERT INTO requests (url, headers, body) VALUES ($1, $2, $3) RETURNING (headers)",
      [url, headers, body]
    )
    .then((result) => {
      console.log(result.rows[0].headers.host);
      res.status(200).json(result.rows[0].headers.host);
    })
    .catch((err) => console.log(err.stack));
};

module.exports = {
  getRequests,
  addRequest,
};
