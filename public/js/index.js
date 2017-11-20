var socket = io();
moment().locale("da");

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
  var formattedTime = moment(message.createdAt).format("llll"); //skal fikses så der ikke står pm/am
  var li = jQuery("<li></li>");
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("LTS"); //skal fikses så der ikke står pm/am
  var li = jQuery("<li></li>");
  var a = jQuery('<a target="_blank">Min nuværende placering</a>');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr("href", message.url);
  li.append(a);
  jQuery("#messages").append(li);
});

jQuery("#message-form").on("submit", function(e) {
  e.preventDefault();

  var messageTextbox = jQuery("[name=message]");

  socket.emit(
    "createMessage",
    {
      from: "User",
      text: messageTextbox.val()
    },
    function() {
      messageTextbox.val("");
    }
  );
});

var locationButton = jQuery("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolocation understøttes ikke af din browser.");
  }

  locationButton.attr("disabled", "disabled").text("Sender placering...");

  navigator.geolocation.getCurrentPosition(
    function(position) {
      locationButton.removeAttr("disabled").text("Send din placering");
      socket.emit("createLocationMessage", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() {
      locationButton.removeAttr("disabled").text("Send din placering");
      alert("Kunne ikke finde placering");
    }
  );
});
