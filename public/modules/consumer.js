// import required modules
const env = require("dotenv").config();
const Channel = require("../models/channel");
const DBHandler = require("../models/dbhandler");

// read message queue name & polling time from .env config
const queue = process.env.MSG_QNAME;
const pollTime = process.env.POLL_TIME;

module.exports = startPolling;

// function to poll RabbitMQ message queue after definite intervals check for
// new messages & perform db operation in case of presence of new message
function startPolling() {
  console.log("Polling started...");

  // function call to get RabbitMQ queue connection and channel
  Channel(queue, function(err, channel, conn) {
    if (err) {
      console.error(err.stack);
    }
    else {
      console.log("channel and queue created");
      consumeMsg();
    }

    // function to fetch & consume message queue messages
    function consumeMsg() {
      channel.get(queue, {}, onConsume);

      // function to perform db operation on presence of new message
      function onConsume(err, msg) {
        if (err) {
          console.warn(err.message);
        }
        else if (msg) {
          setTimeout(function() {
            // function call to get data from redis & insert to mongodb
            DBHandler.getToDoFromRedis(msg.content.toString(), function(err) {
              if(err){
                console.log(err);
              } else{
                channel.ack(msg);
              }
            });

            consumeMsg();
          }, pollTime);
        }
        else {
          setTimeout(consumeMsg, pollTime);
        }
      }
    }
  });
}
