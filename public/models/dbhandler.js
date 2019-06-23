// import required modules
const env = require("dotenv").config();
const redis = require("redis");
const mongoose = require("mongoose");

// get values from .env config file
const REDIS_PORT = process.env.REDIS_PORT;
const REDIS_HOST = process.env.REDIS_HOST;

const MONGO_CONN_STR = process.env.MONGO_CONN_STR;

const clientRedis = redis.createClient(REDIS_PORT, REDIS_HOST);

// Connecting to redis
clientRedis.on("connect", function() {
  console.log("Redis client connected");
});

// Handling error while connecting to redis
clientRedis.on("error", function (err) {
  console.log("Something went wrong while connecting to redis server. Error: " + err);
});

// Connecting to mongodb
mongoose.connect(MONGO_CONN_STR, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB client connected");
  }).catch(err => {
    console.log("Something went wrong while connecting to mongodb server. Error: ", err);
  });

// create mongodb schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String
});

// create model for mongodb schema
const TodoItem = mongoose.model("TodoItem", todoSchema);

// function to get todoItem from redis & delete that todoItem from
// redis after successful insertion into mongodb
function getToDoFromRedis(todoId, cb) {
  let id = todoId.substring(1, todoId.length - 1);
  let objTodo;

  // get todoItems from redis
  clientRedis.get("todo:" + id, function (error, result) {
    if (error) {
      cb(error);
    } else {
      if (result != null) {
        objTodo = JSON.parse(result);

        // store fetched todoItem in mongodb model object
        const todoItem = new TodoItem({
          title: objTodo.title,
          description: objTodo.desc
        });

        // save fetched todoItem in mongodb
        todoItem.save(function(err) {
          if(!err) {
            // delete saved todoItem from redis
            clientRedis.del("todo:" + id);
            cb(null);
          } else {
            cb(err);
          }
        });
      } else {
        cb(null);
      }
    }
  });
}

module.exports = {
  getToDoFromRedis,
  TodoItem
}
