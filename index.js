const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const path = require("path");
const stats = require("./fetchData");
const sync = require("./syncData");
const time = require("./getTime");
const globals = require("./globals");

// Fetch data every minute.
cron.schedule("* * * * *", () => {
  stats.fetchAllData();
});

const getContent = async (res, view) => {
  await sync.gatherAllRegions().then(data => {
    res.render(view, {
      data: {
        ...data,
        lastUpdated: time.getTimeSinceLastUpdated(data.lastUpdated),
        displayOrder: globals.displayOrder
      }
    });
  });
};

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => getContent(res, "data"));
app.get("/about", (req, res) => res.render("about"));
app.get("/data", (req, res) => getContent(res, "data"));
app.get("/faq", (req, res) => res.render("faq"));
app.get("/map", (req, res) => res.render("map"));
app.get("/preparation", (req, res) => res.render("prepping"));
app.get("/prevention", (req, res) => res.render("prevention"));
app.get("/tweets", (req, res) => res.render("tweets"));
app.get("/wiki", (req, res) => res.render("coronainfo"));
app.get("/travel", (req, res) => res.render("travel"));
app.get("/press", (req, res) => res.render("press"));
app.get("/email", (req, res) => res.render("email"));
app.get("/data-discovery", (req, res) => res.render("data-discovery"));

stats.fetchAllData().then(data => {
  app.listen(process.env.PORT || 3000);
  console.log("Listening on port: " + 3000);
});
