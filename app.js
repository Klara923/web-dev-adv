const express = require("express");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});

app.get("/discover", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "discover.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "login.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
