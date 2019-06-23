# Node-ToDo-List

Node service making use of Express, RabbitMQ, Redis &amp; Mongoose. The service polls a messaging queue with the help of RabbitMQ to check for the presence of new mesagges which inform the service about presence of data (To-Do items) in Redis database. The service then reads this data from Redis and uploads it into a mongodb database, deleting it from Redis while acknowledging the message present on messaging queue. The service also provides a GET api endpoint to serve the data stored in mongodb to users in JSON format.


# Steps to Setup
 
 1. Install dependencies by using following command:
    npm install
    
 2. Configure following values in .env file:
    PORT = < Port on which the service will run >
    MSG_QNAME = < Queue name configured (on which service will poll for messages) in RabbitMQ >
    POLL_TIME = < Wait time before polling message queue again >
    AMQP_URL = < RabbitMQ connection url >
    REDIS_PORT = < Port on which redis server is running >
    REDIS_HOST = < Host address where redis server is running >
    MONGO_CONN_STR = < Connection url for mongodb >
    
    Sa,ple config values are as follows:
    PORT = 3000
    MSG_QNAME = todolistqueue
    POLL_TIME = 3e3
    AMQP_URL = amqp://guest:guest@localhost:5672
    REDIS_PORT = 6379
    REDIS_HOST = 127.0.0.1
    MONGO_CONN_STR = mongodb://localhost/ToDoDB
    
 3. Start the service using following command:
    npm start


You can browse the apis GET endpoint at http://< Node Service Host Address >:< Configured Port>. 
Eg: http://localhost:3000 
