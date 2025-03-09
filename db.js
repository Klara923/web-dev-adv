const { Pool } = require("pg");
const pool = new Pool({
  host: "db",
  port: "5432",
  user: "user123",
  password: "password123",
  database: "db123",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool
  .connect()
  .then((client) => {
    console.log("Connected to database");
    client.release();
  })
  .catch((err) => console.error("Database connection error:", err.stack));

const query = (text, params) => pool.query(text, params);

module.exports = pool;
