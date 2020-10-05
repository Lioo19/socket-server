import { findAll, addToCollection } from "./db/db.js";

const express = require('express');
const app = express();
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

const dsn = "mongodb://localhost:27017/chat";

const projection = {
    name: 1,
    msg: 1,
    time: 1,
    _id: 0
};

const dbName = "log";

// // Add headers
// app.use(function (req, res, next) {
//
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'https://me.linneaolofsson.me');
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//
//     // Pass to next layer of middleware
//     next();
// });

// app.use(cors());
app.use(cors({origin: ['http://localhost:3000', 'https://me.linneaolofsson.me'] }));

io.origins(['https://me.linneaolofsson.me:*','http://localhost:3000']);

io.on('connection', function (socket) {

    socket.on('chatmsg', function (message) {
        io.emit('chatmsg', message);
    });

    socket.on("chatLogRequest", function (message) {
        findAll(dsn, dbName, projection)
        .then(res => {
            io.emit("chatLogConfirmed", res)})
        .catch(err => console.log(err));
    });

    //Works, saves message when user connected
    socket.on('userConnected', function (message) {
        io.emit('chatmsg', message);
        // addToCollection(dsn, dbName, message);
    });

    //works, saves messages sent to database
    socket.on("send", function (message) {
        io.emit('chatmsg', message);
        // addToCollection(dsn, dbName, message);
    });


    io.on("disconnect", function (socket) {
        console.info("Disconnected");
    });
});

server.listen(8300);
console.log("server is listening on port 8300")
