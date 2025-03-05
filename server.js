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
app.get("/add-venue", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "add-venue.html"));
});
app.get("/edit-venue", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "edit-venue.html"));
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
    const result = await pool.query("SELECT * FROM venues ORDER BY name ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error retrieving venues:", err);
    res.sendStatus(500);
  }
});

app.get("/api/venues/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM venues WHERE id = $1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Venue not found" });

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error retrieving venue:", err);
    res.sendStatus(500);
  }
});

app.put("/api/venues/:id", async (req, res) => {
  const { id } = req.params;
  const { name, url, district } = req.body;

  try {
    const result = await pool.query(
      "UPDATE venues SET name = $1, url = $2, district = $3 WHERE id = $4 RETURNING *",
      [name, url, district, id]
    );

    if (result.rowCount === 0)
      return res.status(404).json({ error: "Venue not found" });

    res.status(200).json({ message: "Venue updated successfully" });
  } catch (err) {
    console.error("Error updating venue:", err);
    res.sendStatus(500);
  }
});

app.delete("/api/venues/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM venues WHERE id = $1", [id]);
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (err) {
    console.error("Error deleting venue:", err);
    res.sendStatus(500);
  }
});

app.post("/api/venues/new", async (req, res) => {
  const { vname, vurl, vdistrict } = req.body;

  try {
    await pool.query(
      "INSERT INTO venues (name, url, district) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING",
      [vname, vurl, vdistrict]
    );

    res.status(201).json({ message: "Venue added successfully" });
  } catch (err) {
    console.error("Error adding venue:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/venues/edit/:id", async (req, res) => {
  const { vname, vurl, vdistrict } = req.body;
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE venues SET name = $1, url = $2, district = $3 WHERE id = $4 RETURNING *",
      [vname, vurl, vdistrict, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Venue not found" });
    }

    res.status(200).json({ message: "Venue updated successfully" });
  } catch (err) {
    console.error("Error updating venue:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server has started on port 13000`);
  });
});
