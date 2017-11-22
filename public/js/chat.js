var socket = io();
moment().locale("da");

function scrollToBottom() {
  // Selectors
  var messages = jQuery("#messages");
  var newMessage = messages.children("li:last-child");
  // Heights
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (
    clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
    scrollHeight
  ) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on("connect", function() {
  var params = jQuery.deparam(window.location.search);
  socket.emit("join", params, function(err) {
    if (err) {
      alert(err); //kan ændres til boostrap eller andet flottere fejlmeddelse.
      window.location.href = "/";
    } else {
      console.log("No error");
    }
  });
});

socket.on("disconnect", function() {
  var date = new Date();
  var time = date.toLocaleTimeString();
  console.log("Disconnected from server at: " + time);
});

socket.on("newMessage", function(message) {
  var formattedTime = moment(message.createdAt).format("LTS"); //skal fikses så der ikke står pm/am
  var template = jQuery("#message-template").html();
  if (message.text !== "") {
    var html = Mustache.render(template, {
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    jQuery("#messages").append(html);
    scrollToBottom();
  } else {
    return alert("du skal skrive noget");
  }
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
  scrollToBottom();
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
