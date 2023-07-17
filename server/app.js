const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    console.log("joined room:", data);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("send message: ", data);
    socket.to(data.room).emit("receive_message", data);
  });
});

server.listen(4040, () => {
  console.log("SERVER IS RUNNING");
});
