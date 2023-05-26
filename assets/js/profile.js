const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();
  const files = document.getElementById("files");
  const formData = new FormData();
  for (let i = 0; i < files.files.length; i++) {
    formData.append("files", files.files[i]);
  }
  fetch("http://127.0.0.1:3000/upload_files", {
    method: "POST",
    body: formData,
  })
    .then(async (res) => {
      const body = await res.json();
      console.log(body);
      document.getElementById("profilepicture").src = body.imagepath;
    })
    .catch((err) => ("Error occured", err));
}
