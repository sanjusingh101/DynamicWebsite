const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

// This decides which page everyone sees
let currentPage = "home.html";

// Main website
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", currentPage));
});

// Admin page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "admin.html"));
});

// Change the page
app.post("/change", (req, res) => {
    currentPage = req.body.page;
    res.redirect("/admin");
});

// Start the server
app.listen(3000, () => {
    console.log("Website running at http://localhost:3000");
});