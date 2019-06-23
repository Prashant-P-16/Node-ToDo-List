# Node-ToDo-List

Node service making use of Express, RabbitMQ, Redis &amp; Mongoose. The service polls a messaging queue with the help of RabbitMQ to check for the presence of new mesagges which inform the service about presence of data (To-Do items) in Redis database. The service then reads this data from Redis and uploads it into a mongodb database, deleting it from Redis while acknowledging the message present on messaging queue. The service also provides a GET api endpoint to serve the data stored in mongodb to users in JSON format.


# Steps to Setup
 
 1. Clone the project. 
 
 2. Install dependencies by using following command: <br />
    ````bash 
    npm install
    ````
    
 3. Configure following values in .env file: <br />
    PORT = < Port on which the service will run > <br />
    MSG_QNAME = < Queue name configured (on which service will poll for messages) in RabbitMQ > <br />
    POLL_TIME = < Wait time before polling message queue again > <br />
    AMQP_URL = < RabbitMQ connection url > <br />
    REDIS_PORT = < Port on which redis server is running > <br />
    REDIS_HOST = < Host address where redis server is running > <br />
    MONGO_CONN_STR = < Connection url for mongodb > <br />
    
    Sample config values are as follows: <br />
    PORT = 3000 <br />
    MSG_QNAME = todolistqueue <br />
    POLL_TIME = 3e3 <br />
    AMQP_URL = amqp://guest:guest@localhost:5672 <br />
    REDIS_PORT = 6379 <br />
    REDIS_HOST = 127.0.0.1 <br />
    MONGO_CONN_STR = mongodb://localhost/ToDoDB <br />
    
 4. Start the service using following command: <br />
    ````bash 
    npm start
    ````

You can browse the apis GET endpoint at http://< Node Service Host Address >:< Configured Port>. 
Eg: http://localhost:3000 
