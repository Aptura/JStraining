// Function to check if 'username' and 'pass' are great
function checkUserLogin(username, password) {
  let body = {
    pseudo: username,
    pass: password,
  };
  console.log(body);
  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/checkauth");
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.readyState == 4 && xhr.status == 200) {
        const data = xhr.response;
        if (data.error) {
          alert(data.message);
          return;
        }
        window.location.href = "/profile";
      } else {
        console.log(`Error: ${xhr.status}`);
      }
    };
    xhr.send(JSON.stringify(body));
  } catch (error) {
    console.log(error);
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
