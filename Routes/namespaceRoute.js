const router = require("express").Router();

const Namespace = require("../Models/Namespace");
const User = require("../Models/User");

router.post("/newNamespace", async (req, res) => {
  const newNamespace = new Namespace({
    name: req.body.name,
    messaages: []
  });
  await newNamespace.save();
  res.json({
    res: "success",
    data: newNamespace,
  });
});

router.get("/namespace", async (req, res) => {
  const namespaces = await Namespace.find({});
  res.json({
    res: "success",
    data: namespaces,
  });
});

router.post("/deleteNamespace", async(req,res)=>{
  const deleteDoc = await Namespace.deleteOne({name: req.body.name})
  console.log(deleteDoc);

})

router.post("/joinNamespace", async(req,res)=>{
  console.log(req.body);
  const user = await User.findOne({_id: req.body.userId})
  const namespace = await Namespace.findOne({_id: req.body.namespaceId})
  const nm = {name: namespace.name, _id: namespace.id}
  user.namespaces.push(nm)
  user.save()
})

router.post("/chatHistory", async(req,res)=>{
  // console.log(req.body.name);
  let nm = await Namespace.findOne({name: req.body.name})
  if(nm){
  var msgs = nm.messages
  // console.log(msgs);
  res.json({
    res: "success",
    messages: msgs,
    id: nm._id
  })
}
})

module.exports = router;
