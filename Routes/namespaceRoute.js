const router = require("express").Router();

const Namespace = require("../Models/Namespace");

router.post("/newNamespace", async (req, res) => {
  const newNamespace = new Namespace({
    name: req.body.name,
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

module.exports = router;
