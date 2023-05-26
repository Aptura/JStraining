const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

// Database with login information
let db = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

let cookiedb = JSON.parse(fs.readFileSync("./db/cookiedb.json", "utf8"));

function saveDB() {
  fs.writeFile("./db/db.json", JSON.stringify(db), (error) => {
    if (error) throw error;
  });

  fs.writeFile("./db/cookiedb.json", JSON.stringify(cookiedb), (error) => {
    if (error) throw error;
  });
}

setInterval(() => saveDB(), 2000);

// My static data
app.use("/assets", express.static(__dirname + "/assets"));

// My website
app.get("/login", function (req, res) {
  let mapage = fs.readFileSync("./old/login.html", "utf8");
  res.send(mapage);
});

app.get("/error", function (req, res) {
  let mapage = fs.readFileSync("./old/error.html", "utf8");
  res.set("Content-Type", "text/html");
  res.send(mapage);
});

app.get("/profile", function (req, res) {
  let text = "";
  const usercookie = req.cookies.authtoken;
  const user = cookiedb.find((x) => x.cookie == usercookie);
  if (!user) {
    res.send("Ptdr t ki ?");
    return;
  }
  const userdata = db.find((x) => x.pseudo == user.pseudo);
  let mapage = fs.readFileSync("./old/account.html", "utf8");
  mapage = mapage
    .replace("__USERNAME__", user.pseudo)
    .replace("__PASS__", userdata.pass)
    .replace("__IMGURL__", "./assets/img/default.jpg");
  res.send(mapage);
});

function checkUserLogin(username, password) {
  let check = db.find((x) => x.pseudo == username && x.pass == password);
  if (check) {
    return true;
  } else {
    return false;
  }
}

function createRandomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function createCookie(value, day) {
  let exp = "";
  if (day) {
    date = new Date();
    date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
    exp = "; expires=" + date.toGMTString();
  }
  return "authtoken=" + value + exp + "; path=/";
  // document.cookie = username + "=" + value +  exp + "; path=/";
}

app.post("/api/checkauth", function (req, res) {
  const reponse = checkUserLogin(req.body.pseudo, req.body.pass);
  if (!reponse) {
    res.json({ error: true, message: "Euuuuhh nique ta mère" });
    return;
  }
  const idCookie = createRandomString(20);
  cookiedb.push({
    pseudo: req.body.pseudo,
    cookie: idCookie,
  });
  const headercookie = createCookie(idCookie, 1);
  res.set("set-cookie", headercookie);
  res.json({ error: false, message: "Ok" });
});

app.listen(3000);
