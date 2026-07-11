const express = require("express");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

// Current page shown to all visitors
let currentPage = "home.html";

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", currentPage));
});

// Admin page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "pages", "admin.html"));
});

// Change page
app.post("/change", (req, res) => {
    currentPage = req.body.page;
    res.redirect("/admin");
});

// Start server (works locally and on Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});