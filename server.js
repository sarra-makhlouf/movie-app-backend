const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectID } = require("mongodb");
const assert = require("assert");

const app = express();
app.use(bodyParser.json());

const MongoUrl = "mongodb://localhost:27017";

const dataBase = "MovieList";

app.get("/home", (req, res) => {
  res.send("hello");
});

MongoClient.connect(MongoUrl,{ useNewUrlParser: true }, (err, client) => {
    assert.equal(err, null, "dataBase connection failed");
    const db = client.db(dataBase);

  app.post('/add-movie', (req, res) => {
      let newMovie = req.body
      db.collection('movies').insertOne(newMovie, (err, data) => {
        if(err) res.send("can't add new movie")
        res.send("new movie added")
      })
  })

  app.get('/movies', (req, res) => {
      db.collection('movies').find().toArray((err, data) => {
        if(err) res.send("can't show movie list")
        res.send(data)
      })
  })

  app.put('/modify_movie/:id', (req, res) => {
    let id = ObjectID(req.params.id)
      db.collection('movies').findOneAndUpdate({_id: id},{$set: {...req.body}}, (err, data) => {
        if(err) res.send("can't delete movie") 
        res.send(data)
      })
  })

  app.delete('/delete_movie/:id', (req, res) => {
    let id = ObjectID(req.params.id)
      db.collection('movies').findOneAndDelete({_id: id}, (err, data) => {
        if(err) res.send("can't delete movie")
        res.send(data)
      })
  })

}
);

app.listen(4000, err => {
  if (err) console.log("there is an error");
  console.log("server is running on port 4000");
});