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
var messages=[]
async function find() {
  // const namespace = await Namespace.find({});
  // console.log(namespace);
  // namespace.forEach((ns) => {
    // console.log(ns);
    io.on("connect", (socket1) => {
      // console.log(ns.name, socket1.id);
      // socket1.on("name",(name)=>{
      //   console.log(name);
      // })
      socket1.on("newMessage",async (message) => {
        // console.log(message.user);
        // nm = await Namespace.find({name: message.namespace})
        // console.log(message);
        // console.log(nm);
        let nmspace = await Namespace.findOne({name: message.namespace})
        nmspace.messages.push(message)
        nmspace.save()
        console.log(nmspace);
      //   Namespace.update(
      //     { name: message.namespace}, 
      //     { $push: { messages: message } }
      // );
        messages.push(message)
        io.emit("messageFromServer",{message})
        // console.log(message);
      });
      app.post("/deleteMsg", async(req,res)=>{
        console.log(req.body.message.message);
        let nm = await Namespace.findOne({name: req.body.namespace})
        // console.log(nm.messages.length);
        let arr = nm.messages
        arr = arr.filter((element)=>{
          return element.message != req.body.message.message
        })
        nm.messages = arr
        nm.save()
        io.emit("chatHistory", {messages: nm.messages})
        res.json({
          res: "success",
        })
      })
      async function chatHistory(namespace){
        console.log(namespace);
        const nm = await Namespace.findOne({name: namespace})
        const msgs = nm.messages
        
      }
    });
  // });
}
find();


// io.on("connect", (socket) => {
//   socket.on("namespaceChange", (n)=>{
//     console.log("changed",n);
//   })
//   console.log("Some One Joined");
//   socket.on("sendMsg", (id) => {
//     console.log(id);
//     console.log(io.of("/").sockets.size);
//   });
//   socket.on("disconnect", () => {
//     console.log("gone");
//   });
//   socket.on("namespace", (name) => {
//     console.log(name);
//     io.of("/" + name).on("connect", (socket1) => {
//       console.log(socket1.id);
//     });
//   });
// });
