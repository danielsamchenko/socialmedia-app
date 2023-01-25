let host = ["localhost", "YOUR_OPENSTACK_IP"];

window.addEventListener('load', () => {

    document.getElementById("submit").onclick = save;

});

function save(){

	document.getElementById("error").innerHTML = "";
	let name = document.getElementById("name").value;
	let pass = document.getElementById("pass").value;
	let newUser = { username: name, password: pass, uploads: [], likes: [],reviews: [], artist: false, followers: [], following: []};

	fetch(`http://${host[0]}:3000/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    })
    .then((response) => {
        if (!response.ok) {
			document.getElementById("name").value = '';
			document.getElementById("pass").value = '';
			document.getElementById("error").innerHTML = "That username is taken. Please use a different username.";
        } else {
			location.href=`http://${host[0]}:3000/`;
		}
    })
    .catch((error) => console.log(err));

}

