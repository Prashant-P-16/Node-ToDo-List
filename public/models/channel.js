// import required modules
const amqp = require("amqplib/callback_api");
const env = require("dotenv").config();

// get RabbitMQ url value from .env file
const url = process.env.AMQP_URL || "amqp://guest:guest@localhost:15672";

module.exports = createQueueChannel;

// function to get RabbitMQ queue connection and channel
function createQueueChannel(queue, cb) {
  amqp.connect(url, onceConnected);

  // function to create channel once RabbitMQ is connected
  function onceConnected(err, conn) {
    if (err) {
      cb(err);
    }
    else {
      // call to create channel
      conn.createChannel(onceChannelCreated);
    }

    // function to assert queue once channel is created
    function onceChannelCreated(err, channel) {
      if (err) {
        cb(err);
      }
      else {
        // call to assert existence of queue
        channel.assertQueue(queue, {durable: true}, onceQueueCreated);
      }

      // function to return queue connection and channel or error
      function onceQueueCreated(err) {
        if (err) {
          cb(err);
        }
        else {
          cb(null, channel, conn);
        }
      }
    }
  }
}
