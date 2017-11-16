var socket = io();

socket.on("connect", function() {
  var date = new Date();
  var time = date.toLocaleTimeString();
  console.log("Connected to server at: " + time);
});

socket.on("disconnect", function() {
  var date = new Date();
  var time = date.toLocaleTimeString();
  console.log("Disconnected from server at: " + time);
});

socket.on("newMessage", function(message) {
  console.log("newMessage", message);
});           
