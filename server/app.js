const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const { AccessToken } = require("livekit-server-sdk");
const cors = require("cors");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
const createToken = (roomName, participantName) => {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  // const roomName = "quickstart-room";
  // identifier to be used for participant.
  // it's available as LocalParticipant.identity with livekit-client SDK
  // const participantName = "quickstart-username";

  const at = new AccessToken(
    "APIFMT6PneiRKhj",
    "UJKv7jsi3Plxo4H30IuEOAwdQjZ1rJChl8ujqbLlnbH",
    {
      identity: participantName,
    }
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
};

app.use(express.static("public"));
app.get("/getToken/:roomID/:username", (req, res) => {
  res.json({ token: createToken(req.params.roomID, req.params.username) });
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

  socket.on("create_call", (data) => {
    console.log("created call: ", data);
    socket.to(data.room).emit("calling", data);
  });

  // socket.on("send_image", (data) => {
  //   const base64Data = data.image.replace(/^data:image\/png;base64,/, "");
  //   const imageFilename = `image_${Date.now()}.png`;

  //   fs.writeFile(`public/${imageFilename}`, base64Data, "base64", (err) => {
  //     if (err) {
  //       console.error("Error saving image:", err);
  //     } else {
  //       console.log("Image saved:", imageFilename);
  //       // Broadcast the image filename to all clients (including the sender)
  //       socket.to(data.room).emit("receive_image", { filename: imageFilename });
  //     }
  //   });
  // });
});

io.on("disconnection", (socket) => {
  console.log(`User disconnected: ${socket.id}`);
});

server.listen(4020, () => {
  console.log("SERVER IS RUNNING");
});
