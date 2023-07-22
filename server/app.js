const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.static("public"));

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

  socket.on("send_image", (data) => {
    const base64Data = data.image.replace(/^data:image\/png;base64,/, "");
    const imageFilename = `image_${Date.now()}.png`;

    fs.writeFile(`public/${imageFilename}`, base64Data, "base64", (err) => {
      if (err) {
        console.error("Error saving image:", err);
      } else {
        console.log("Image saved:", imageFilename);
        // Broadcast the image filename to all clients (including the sender)
        socket.to(data.room).emit("receive_image", { filename: imageFilename });
      }
    });
  });
});

server.listen(4040, () => {
  console.log("SERVER IS RUNNING");
});
