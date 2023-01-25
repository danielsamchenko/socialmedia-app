function like(){
    
    let xhttp = new XMLHttpRequest();

    
    let like = {
        number: "1"
    };


    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            alert("You liked this artwork!");
        }
    }
    xhttp.open("PUT", window.location.href, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(JSON.stringify(like));
}
