const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
const moment = require("moment");
const { generateMessage, generateLocationMessage } = require("./utils/message");

const { isRealString } = require("./utils/validation");
const publicPath = path.join(__dirname, "../public");
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on("connection", socket => {
  console.log("New user connected at: " + moment().format("LTS"));

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      callback("Navn og navn på rum er påkrævet.");
    }
    socket.join(params.room);

    socket.emit(
      "newMessage",
      generateMessage("Admin", "Velkommen til chatten.")
    );

    socket.broadcast
      .to(params.room)
      .emit(
        "newMessage",
        generateMessage("Admin", `${params.name} er tilsluttet`)
      );

    callback();
  });

  socket.on("createMessage", (message, callback) => {
    console.log("createMessage", message);
    io.emit("newMessage", generateMessage(message.from, message.text));
    callback();
  });

  socket.on("createLocationMessage", coords => {
    io.emit(
      "newLocationMessage",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  socket.on("disconnect", () => {
    console.log("User disconnected at: " + moment().format("LTS"));
  });
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
