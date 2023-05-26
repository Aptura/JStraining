const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const app = express();
const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    if (file.mimetype == "image/png") {
      cb(null, Date.now() + ".png");
    } else if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, Date.now() + ".jpg");
    } else if (file.mimetype == "image/gif") {
      cb(null, Date.now() + ".gif"); // aptura est riche
    } else {
      cb(null, "hack.alice");
    }
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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
app.use("/uploads", express.static(__dirname + "/uploads"));

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
    .replace("__IMGURL__", userdata.image);
  res.send(mapage);
});

app.get("/upload_files", function (req, res) {});

function checkUserLogin(username, password) {
  let check = db.find((x) => x.pseudo == username && x.pass == password);
  if (check) {
    return true;
  } else {
    return false;
  }
}

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.files);
  for (const file of req.files) {
    if (file.filename == "hack.alice") {
      fs.unlinkSync("./uploads/hack.alice");
    }
  }
  // update user database
  const usercookie = req.cookies.authtoken;
  const user = cookiedb.find((x) => x.cookie == usercookie);
  if (!user) {
    res.send("Ptdr t ki ?");
    return;
  }
  db.find((x) => x.pseudo == user.pseudo).image =
    "/uploads/" + req.files[0].filename;

  res.json({
    message: "Successfully uploaded files",
    imagepath: "/uploads/" + req.files[0].filename,
  });
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
