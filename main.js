const express = require("express");
const fs = require("fs");
const app = express();

// My static data
app.use("/assets", express.static(__dirname + "/assets"));

// My website
app.get("/login", function (req, res) {
  let mapage = fs.readFileSync("./old/login.html", "utf8");
  res.send(mapage);
});

app.get("/sucess", function (req, res) {
  let mapage = fs.readFileSync("./old/sucess.html", "utf8");
  res.set("Content-Type", "text/html");
  res.send(mapage);
});

app.get("/error", function (req, res) {
  let mapage = fs.readFileSync("./old/error.html", "utf8");
  res.set("Content-Type", "text/html");
  res.send(mapage);
});

app.listen(3000);
