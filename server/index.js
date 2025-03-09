const express = require('express');
const { createServer } = require('node:http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello, World!</h1>');
});

let rooms = {};

io.on('connection', (socket) => {
    console.log("a user connected!", socket.id);
    
    let assignedRoom = null;

    for (let room in rooms) {
        console.log(room);
        if (rooms[room] < 2) {
            assignedRoom = room;
            break;
        }
    }

    if (!assignedRoom) {
        assignedRoom = `room-${Date.now()}`;
        rooms[assignedRoom] = 0;
    }

    socket.join(assignedRoom);
    rooms[assignedRoom] += 1;
    console.log(`Player ${socket.id} joined ${assignedRoom}, player count: ${rooms[assignedRoom]}`);

    // If room is full, notify both players and send ready signal
    if (rooms[assignedRoom] === 2) {
        io.to(assignedRoom).emit('ready', 'Both players are ready!');
    }

    socket.on("add", (jsonData) => {
        console.log("Data Arrived from:", socket.id, "\nData:", jsonData);
        socket.to(assignedRoom).emit('added', jsonData);
    })

    socket.on('disconnect', () => {
        console.log("user disconnected");

        rooms[assignedRoom] -= 1;
        if (rooms[assignedRoom] === 0) {
            delete rooms[assignedRoom];
        }
    });
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});