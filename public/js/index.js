$(document).ready(function() {
  let socket = io();
  let time = moment().format("LT");
  let user = {};
  $("#join-chat-btn").on("click", function() {
    user.name = prompt("enter your name");
    user.join = time;
    socket.emit("user added", user);
    socket.on("user added", function(users, messages) {
      $("#people-list").html(" ");
      users.forEach(user => {
        $("#people-list").append(
          ` <li class="people-list-item mt-1">${user.name}<span class="time-stamp float-right"> ${user.join}</span>`
        );
      });
      showMessages(messages);
    });

    $("#join-chat-btn").hide();
  });

  $("#msg-send-btn").on("click", function(e) {
    e.preventDefault();
    if (!user.name) {
      alert("First join chat");
    } else {
      const msg = {};
      let inputValue = $("#msg-input").val();
      msg.from = user.name;
      msg.text = inputValue;
      msg.time = time;
      socket.emit("chat message", msg);
    }
  });

  socket.on("chat message", function(messages) {
    console.log(messages);
    showMessages(messages);
  });

  function showMessages(messages) {
    $("#msg-container").html(" ");
    messages.forEach(msg => {
      if (user.name === msg.from) {
        console.log(user.name === msg.from);
        $("#msg-container")
          .append(` <li class="msg mb-2 color-sender text-wrap ml-auto"><h6 class="sender">${msg.from}</h6>${msg.text} <span class="sender-time-stamp"> ${msg.time}</span></li>
    `);
      } else {
        $("#msg-container")
          .append(` <li class="msg mb-2 text-wrap mr-auto"><h6 class="sender">${msg.from}</h6>${msg.text} <span class="sender-time-stamp"> ${msg.time}</span></li>
    `);
      }
    });
  }
});
