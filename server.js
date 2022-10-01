//Dependencies
const path = require("path")
const express = require("express");
const fs = require("fs");

//Path
const db = path.join(__dirname, "/db")
const mainPath = path.join(__dirname, "/public")

// Setting the express server
const app = express();

// Adding the port 
const PORT = process.env.PORT || 3007;

// Handling pare data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"))

// ROUTES

// GET Requests:
app.get("/notes", function(req, res) {
    res.sendFile(path.join(mainPath, "notes.html"));
});

//API GET Requests:
app.get("/api/notes", function(req, res) {
    //google return json files using app.get
    res.sendFile(path.join(db, "db.json"))
    return res.body

})
app.get("*", function(req, res) {
    res.sendFile(path.join(mainPath, "index.html"));
});

// POST Requests:
app.post("/api/notes", function(req, res) {
    var notesArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    var note = req.body;

    note.id = (notesArray.length).toString();
    notesArray.push(note);


    fs.writeFileSync("./db/db.json", JSON.stringify(notesArray));
    if (!validateNote(req.body)) {
            res.status(400).send('The note is not properly formatted.');
          } else {
            res.json(notesArray);
          }

    res.json(notesArray);
})
//API DELETE Requests: 
app.delete("/api/notes/:id", function(req, res) {

    //read data
    var notesArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notesArray = notesArray.filter(({ id }) => id !== req.params.id);
   
    fs.writeFileSync("./db/db.json", JSON.stringify(notesArray));
    return res.json(notesArray);
});

// LISTENER 


app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});


