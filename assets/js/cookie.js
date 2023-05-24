// Function for create cookie
function createCookie(username, value, day) {
  if (day) {
    date = new Date();
    date.setTime(date.getTime() + day * 24 * 60 * 60 * 1000);
    let exp = "; expires=" + date.toGMTString();
  } else {
    let exp = "";
  }
  document.cookie = username + "=" + value + exp + "; path=/";
}

// Function for get cookie
function getCookie(username) {
  let idCookie = username + "=";
  let cookieTab = document.cookie.split(";");
  for (var i = 0; i < cookieTab.length; i++) {
    let c = cookieTab[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1, c.length);
    }
    if (c.indexOf(idCookie) == 0) {
      return c.substring(idCookie.length, c.length);
    }
  }
  return null;
}

// Function for delete cookie
function delCookie(username) {
  createCookie(username, "", -1);
}
