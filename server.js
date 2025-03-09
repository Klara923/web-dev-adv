const express = require("express");
const path = require("path");
const fs = require("fs").promises;
const { query } = require("./db.js");
const model = require("./models/model");
const port = 3000;
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
const app = express();

const SECRET = "mySecretCookieToken";

const sessions = {};

app.use(cookieParser(SECRET));
app.use(express.urlencoded({ extended: true }))
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
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});
app.post("/login", express.urlencoded({ extended: true }), (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "password") {
    const token = crypto.randomBytes(64).toString("hex");

    sessions[token] = { username };

    res.cookie("authToken", token, { signed: true, httpOnly: true });

    res.redirect("/protected");
  } else {
    res.redirect("/");
  }
});
app.get("/protected", (req, res) => {
  const token = req.signedCookies.authToken;

  if (token && sessions[token]) {
    res.sendFile(path.join(__dirname, "public", "pages", "protected.html"));
  } else {
    res.redirect("/login");
  }
});
app.get("/admin", (req, res) => {
  const token = req.signedCookies.authToken;

  if (token && sessions[token]) {
    res.sendFile(path.join(__dirname, "public", "pages", "admin.html"));
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", (req, res) => {
  const token = req.signedCookies.authToken;

  if (token && sessions[token]) {
    delete sessions[token];
  }

  res.clearCookie("authToken");

  res.redirect("/");
});

app.get("/logout-page", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "logout.html"));
});
async function initializeDatabase() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS venues (
        id SERIAL PRIMARY KEY, 
        name VARCHAR(500) UNIQUE,
        url VARCHAR(500), 
        district VARCHAR(500)
      )
    `);

    const check = await query("SELECT COUNT(*) FROM venues");
    if (check.rows[0].count === "0") { 
      const data = await fs.readFile("venues.json", "utf8");
      const venues = JSON.parse(data);
      
      for (const venue of venues) {
        await query(
          "INSERT INTO venues(name, url, district) VALUES($1, $2, $3) ON CONFLICT (name) DO NOTHING",
          [venue.name, venue.url, venue.district]
        );
      }
      console.log("Database initialized successfully.");
    } else {
      console.log("Database already populated.");
    }
  } catch (err) {
    console.error("Error initializing database:", err);
  }
}

app.get("/api/venues", async (req, res) => {
  try {
    const venues = await model.getAllVenues();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving venues" });
  }
});

app.get("/api/venues/:id", async (req, res) => {
  try {
    const venue = await model.getVenueById(req.params.id);
    if (!venue) return res.status(404).json({ error: "Venue not found" });
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving venue" });
  }
});

app.post("/api/venues/new", async (req, res) => {
  try {
    await model.addVenue(req.body.vname, req.body.vurl, req.body.vdistrict);
    res.status(201).json({ message: "Venue added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error adding venue" });
  }
});

app.put("/api/venues/:id", async (req, res) => {
  try {
    const success = await model.updateVenue(req.params.id, req.body.name, req.body.url, req.body.district);
    if (!success) return res.status(404).json({ error: "Venue not found" });
    res.status(200).json({ message: "Venue updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating venue" });
  }
});

app.delete("/api/venues/:id", async (req, res) => {
  try {
    const success = await model.deleteVenue(req.params.id);
    if (!success) return res.status(404).json({ error: "Venue not found" });
    res.status(200).json({ message: "Venue deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting venue" });
  }
});

initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});