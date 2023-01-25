function follow(){
    alert("Followed!");
    let following = {
        followId: document.getElementById("id").value,
        followUsername: document.getElementById("username").value
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/following";
        }

    }
    xhttp.open("POST", "http://localhost:3000/following", true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send(JSON.stringify(following));

}