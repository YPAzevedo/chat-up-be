const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const http = require("http");

const { addUser, removeUser, getUser, getUserInRoom } = require("./users");

const router = require("./router");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

app.use(router);

io.on("connection", (socket) => {
  console.log("Socket connection");

  socket.on("join", (data, callback) => {
    const { name, room } = data;
    const user = addUser({ id: socket.id, name, room });

    if (!!user.error) {
      return callback(error);
    }

    if (!!user) {
      socket.emit("message", {
        user: "admin",
        text: `${user.name} welcome to the room ${user.room}`,
      });
      socket.broadcast.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has joined!`,
      });
    }

    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: message.text });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUserInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (!!user) {
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} left the room.`,
      });
    }
  });
});

server.listen(PORT, () => console.log(`⚡️ Server running on port ${PORT}`));
