// Database with login information
let db = [
  {
    pseudo: "Alice",
    pass: "azerty+31",
  },
  {
    pseudo: "Axone",
    pass: "azerty+32",
  },
  {
    pseudo: "Aptura",
    pass: "azerty+33",
  },
];

// Function to check if 'username' and 'pass' are great
function checkUserLogin(username, password) {
  let check = db.find((x) => x.pseudo == username && x.pass == password);
  if (check) {
    window.location.href = "./sucess?username=" + username;
  } else {
    window.location.href = "./error.html";
  }
}

// Catch value in form and check if user can login
function getInputValue() {
  // récup des valeurs avec un OnClick sur le bouton Log In
  let username = document.getElementById("pseudostring").value;
  let password = document.getElementById("passstring").value;

  checkUserLogin(username, password);
}

// Create a random string for cookie ID
function CreateRandomString(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
