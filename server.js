const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const socketio = require("socket.io");

app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/cuoraDB");
app.use(cors());

/*************Importing Models************/
const Otp = require("./Models/Otp");
const Namespace = require("./Models/Namespace");
/*************Importing Routes************/
const nodeMailer = require("./Routes/nodeMailer");
app.use(nodeMailer);
const authRoute = require("./Routes/authRoute");
app.use(authRoute);
const namespaceRoute = require("./Routes/namespaceRoute");
app.use(namespaceRoute);

const expressServer = app.listen(4000, () => {
  console.log("Listening On Port 4000");
});

const io = socketio(expressServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

async function find() {
  const namespace = await Namespace.find({});
  console.log(namespace);
  namespace.forEach((ns) => {
    io.of(`/${ns.name}`).on("connect", (socket1) => {
      console.log(ns.name, socket1.id);
      io.of(`/${ns.name}`).on("newMessage", (message) => {
        console.log(message);
      });
    });
  });
}
find();

io.on("connect", (socket) => {
  console.log("Some One Joined");
  socket.on("sendMsg", (id) => {
    console.log(id);
    console.log(io.of("/").sockets.size);
  });
  socket.on("disconnect", () => {
    console.log("gone");
  });
  socket.on("namespace", (name) => {
    console.log(name);
    io.of("/" + name).on("connect", (socket1) => {
      console.log(socket1.id);
    });
  });
});
