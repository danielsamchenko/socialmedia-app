function becomeArtist(session){
    alert("You are now an artist!");
    let artists = {
        artist: true
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/profile" + JSON.parse(xhttp.responseText).id;
        }

    }
    xhttp.open("PUT", window.location.href, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send(JSON.stringify(artists));
}
function becomeUser(session){
    alert("You are now a user!");
    let artists = {
        artist: false
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/profile" + JSON.parse(xhttp.responseText).id;
        }

    }
    xhttp.open("PUT", window.location.href, true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send(JSON.stringify(artists));
}

function addArtwork(){
    alert("Artwork added!");
    let artwork = {
        name: document.getElementById("name").value,
        artist: document.getElementById("artist").value,
        year: document.getElementById("year").value,
        category: document.getElementById("category").value,
        medium: document.getElementById("medium").value,
        description: document.getElementById("description").value,
        image: document.getElementById("url").value,
        likes: "0"
    };
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "http://localhost:3000/gallery";
        }

    }
    xhttp.open("POST", "http://localhost:3000/gallery", true);
    xhttp.setRequestHeader("Content-Type", "application/JSON");
    xhttp.setRequestHeader("Accept", "application/JSON");
    xhttp.send(JSON.stringify(artwork));

}