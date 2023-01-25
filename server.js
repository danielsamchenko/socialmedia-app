
// const express = require('express')
// const session = require('express-session')
// const app = express()
//set up mongodb
const express = require('express');
const session = require('express-session')

const { ObjectID } = require('mongodb');
const app = express();
const mc = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
let db;

//set up pug and express and session
app.use(session({ secret: 'some secret here'}))
app.set("view engine", "pug");
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.json());

//GET method which displays the homepage and navigation header
app.get(['/', '/home'], function(req,res,next){
    if(req.accepts("html")){
        res.render("homepage.pug", { session: req.session });
    }
    else{
        res.sendStatus(404);
        return
    }
});
// Get method for Rendering the registration page.
app.get("/register", (req, res) => {

	res.render("register");

});

app.post("/register", async (req, res) => {

    let newUser = req.body;

    try{
        const searchResult = await db.collection("users").findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await db.collection("users").insertOne(newUser);
            res.redirect("http://localhost:3000");
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }

});
//GET method which displays the login page
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await db.collection("users").findOne({ username: req.body.username});
        if(searchResult != null) {
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                req.session.uploads = searchResult.uploads;
                req.session.likes = searchResult.likes;
                req.session.reviews = searchResult.reviews;
                req.session.artist = searchResult.artist;
                res.render('homepage.pug', { session: req.session })
            } else {
              res.render('errorSignIn.pug', { session: req.session })

            }
        } else {
          res.render('errorSignIn.pug', { session: req.session })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }

});

// Log the user out of the application.
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;
	}
	res.redirect(`http://localhost:3000/home`);

});

//GET method which displays searched artworks
app.get('/gallery', (req, res)=>{
    //Add all database supplies into array
    db.collection("gallery").find({}).toArray(function(err, searchResult) {
        if (err) throw err;
        res.render("search.pug", {items: searchResult})
    });
});

//GET method to display a specific artwork
app.get("/gallery/:id", (req, res, next)=>{
	let id = req.params.id;
	let oid;
	try{
		oid = new ObjectId(id);
	}catch{
		res.status(404).send("That ID does not exist.");
		return;
	}
    //find supply with specific id
	db.collection("gallery").findOne({"_id": oid}, function(err, result){
		if(err){
			res.status(500).send("Error reading database.");
			return;
		}
		if(!result){
			res.status(404).send("That ID does not exist in the database.");
			return;
		}
		res.status(200).render("artwork", {item: result});
	});
});
// post method to add a new artwork to the database and go to the artwork page

app.post("/gallery", async (req, res) => {
    db.collection("users").updateOne({"_id": ObjectId(req.session.userid)}, {$push: {uploads: req.body}});
    db.collection("gallery").insertOne(req.body, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        res.status(200).redirect("/gallery");
    });
});

// put method to update an artwork in the database and go to the artwork page
app.put("/gallery/:id", async (req, res) => {
    console.log(req.params.id);
    let id = req.params.id;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    // update artwork like count by 1 in the database
    db.collection("gallery").updateOne({"_id": oid}, {$inc: {likes: 1}}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).redirect("/gallery/" + id);
});
});


//Get method to display a profile page
app.get("/profile/:id", (req, res) => {
    let id = req.session.userid;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    db.collection("users").findOne({"_id": oid}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).render("profile", {item: result, session: req.session});
    });
});

//post method to display a profile page
app.put("/profile/:id", (req, res) => {
    console.log(req.body.artist);
    let id = req.session.userid;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    req.session.artist = req.body.artist;

    db.collection("users").updateOne({"_id": oid}, {$set: {artist: req.body.artist}}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).render("profile", {item: result, session: req.session});
    });
});

// get method to display all users in the database
app.get("/users", (req, res) => {
    db.collection("users").find({}).toArray(function(err, searchResult) {
        if (err) throw err;
        res.render("users.pug", {items: searchResult})
    });
});

// get method to display a specific user
app.get("/users/:id", (req, res) => {
    let id = req.params.id;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    db.collection("users").findOne({"_id": oid}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).render("user", {item: result,session: req.session});
    });
});
// get method to display following page
app.get("/following", (req, res) => {
    let id = req.session.userid;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    //find user with specific id       
    db.collection("users").findOne({"_id": oid}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).render("following", {items: result, session: req.session});
    });
});

app.post("/following", (req, res) => {
    let id = req.params.id;
    let oid;
    try{
        oid = new ObjectId(id);
    }catch{
        res.status(404).send("That ID does not exist.");
        return;
    }
    //find user with specific id
    db.collection("users").updateOne({"_id": ObjectId(req.session.userid)}, {$push: {following: req.body}}, function(err, result){
        if(err){
            res.status(500).send("Error reading database.");
            return;
        }
        if(!result){
            res.status(404).send("That ID does not exist in the database.");
            return;
        }
        res.status(200).redirect("/following");
    
    });
});

// Initialize database connection
mc.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;
  db = client.db('a5');
  // Start server
  app.listen(3000);
  console.log("Listening on port 3000");
});
