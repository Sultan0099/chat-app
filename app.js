const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const http = require("http").createServer(app);
const io = require("socket.io")(http);
let users = [],
  messages = [];
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", socket => {
  console.log("user connected");

  socket.on("chat message", function(msg) {
    messages.push(msg);
    io.emit("chat message", messages);
  });

  socket.on("user added", function(user) {
    if (users.length > 0) {
      console.log("runs users");
      users.forEach(usr => {
        if (usr.name === user.name) {
          user.name = user.name + Math.floor(Math.random() * 100);
        }
      });
    }
    users.push(user);
    io.emit("user added", users);
  });
});

http.listen(PORT, () => {
  console.log(`server is listening at PORT = ${PORT}`);
});
