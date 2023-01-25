
function login(){
  //new XMLHttpRequest
  let xhttp = new XMLHttpRequest();

  if (document.getElementById("user").value == '' || document.getElementById("password").value == '') {
    alert("Empty Field");
    return;
  }

  let user = {
    username: document.getElementById("user").value,
    password: document.getElementById("password").value
  };


  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      window.location.href = "http://localhost:3000/login";
    }
  }
  xhttp.open("POST", "http://localhost:3000/login", true);
  xhttp.setRequestHeader("Content-Type", "application/JSON");
  xhttp.setRequestHeader("Accept", "application/JSON");
  xhttp.send(JSON.stringify(user));
}
