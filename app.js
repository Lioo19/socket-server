const express = require('express');
const app = express();
const cors = require('cors');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

app.use(cors());

io.origins(['https://server-socket.linneaolofsson.me:443', 'http://localhost:3000'])

io.on('connection', function (socket) {

    socket.on('chat message', function (message) {
        io.emit('chat message', message);
    });

    socket.on('userConnected', function (message) {
        io.emit('chatmsg', message);
    });

    socket.on("send", function (message) {
        io.emit('chatmsg', message);
    });

    io.on("disconnect", function (socket) {
        console.info("Disconnected");
    });
});

server.listen(8300);
console.log("server is listening on port 8300")
