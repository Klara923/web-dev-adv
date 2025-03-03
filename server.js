const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const pool = require("./db");

const port = 3000;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});

app.get("/discover", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "discover.html"));
});

async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS venues (
        id SERIAL PRIMARY KEY, 
        name VARCHAR(500) UNIQUE,
        url VARCHAR(500), 
        district VARCHAR(500)
      )
    `);

    const data = await fs.readFile("venues.json", "utf8");
    const venues = JSON.parse(data);

    for (const venue of venues) {
      await pool.query(
        "INSERT INTO venues(name, url, district) VALUES($1, $2, $3) ON CONFLICT (name) DO NOTHING",
        [venue.name, venue.url, venue.district]
      );
    }
    console.log("Database initialized successfully.");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

app.get("/api/venues", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM venues");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error retrieving venues:", err);
    res.sendStatus(500);
  }
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server has started on ort ${port}`);
  });
});
