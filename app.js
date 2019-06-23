// import required modules
const express = require("express");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const Poll = require("./public/modules/consumer");
const DBHandler = require("./public/models/dbhandler");

// create express app
const app = express();

// get port value from .env file
const PORT = process.env.PORT || 3000;

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// define get route
app.get("/", function(req, res){
  // search db cluster for todoItems & send response for the get request
  DBHandler.TodoItem.find({}, function(err, fetchedToDoItems) {
    if(err) {
      res.status(400).send("Some error occurred. Please contact administrator. Error: " + err);
    } else {
      if(fetchedToDoItems.length == 0) {
        res.status(404).send("No ToDo items found.");
      } else {
        res.status(200).send(fetchedToDoItems);
      }
    }
  });
});

// listen for requests
app.listen(PORT, function() {
  console.log("Server started on port " + PORT);

  // function call which polls message queues for new messages
  Poll();
});
