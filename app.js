import { findAll, addToCollection } from "./db/db.js";

const express = require('express');
const app = express();
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const dsn = "mongodb://localhost:27017/chat";

const projection = {
    name: 1,
    msg: 1,
    time: 1,
    _id: 0
};

const dbName = "log";

app.use(cors());

io.origins(
    [
        'https://me.linneaolofsson.me:443',
        'http://localhost:3000',
        'https://socket-server.linneaolofsson.me:*'
    ]
);

io.on('connection', function (socket) {

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
