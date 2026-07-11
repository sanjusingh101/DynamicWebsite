const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Change this password
const ADMIN_PASSWORD = "123456";

// Current redirect
let redirectUrl = "https://www.youtube.com";

// Visitor
app.get("/", (req, res) => {
    res.redirect(redirectUrl);
});

// Admin page
app.get("/admin", (req, res) => {
    res.send(`
        <h2>Website Controller</h2>

        <form method="POST" action="/update">
            Password:<br>
            <input type="password" name="password"><br><br>

            Redirect URL:<br>
            <input
                type="text"
                name="url"
                value="${redirectUrl}"
                style="width:400px"
            ><br><br>

            <button type="submit">
                Update Redirect
            </button>
        </form>

        <p>Current URL: ${redirectUrl}</p>
    `);
});

// Update redirect
app.post("/update", (req, res) => {

    if (req.body.password !== ADMIN_PASSWORD) {
        return res.send("Wrong password");
    }

    redirectUrl = req.body.url;

    res.send(`
        Redirect updated.<br><br>

        <a href="/admin">Back</a>
    `);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});