function getParameterByName(name) {
  let match = RegExp("[?&]" + name + "=([^&]*)").exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
document.getElementById("username").innerHTML = getParameterByName("username");
