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
  var formattedTime = moment(message.createdAt).format("LTS"); //skal fikses så der ikke står pm/am
  var template = jQuery("#message-template").html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);

  // var li = jQuery("<li></li>");
  // li.text(`${message.from} ${formattedTime}: ${message.text}`);
  // jQuery("#messages").append(li);
});

socket.on("newLocationMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("LTS"); //skal fikses så der ikke står pm/am
  var template = jQuery("#location-message-template").html();
  var html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });
  jQuery("#messages").append(html);
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
