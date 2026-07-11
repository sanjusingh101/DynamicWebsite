const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {

    const control = JSON.parse(
        fs.readFileSync("./control.json", "utf8")
    );

    if (control.mode === "redirect") {
        return res.redirect(control.redirect);
    }

    if (control.mode === "page") {
        return res.sendFile(
            path.join(__dirname, "pages", control.page)
        );
    }

    res.send("Invalid configuration.");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});