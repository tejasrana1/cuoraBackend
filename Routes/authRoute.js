const router = require("express").Router();
const passport = require("passport");
const localStrategy = require("passport-local");
const session = require("express-session");

const User = require("../Models/User");
const Otp = require("../Models/Otp");

router.use(
  session({
    secret: "this.Is.Our.College.Project...",
    resave: false,
    saveUninitialized: false,
  })
);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(User.createStrategy());

router.use(passport.initialize());
router.use(passport.session());

router.post("/register", async (req, res) => {
  try {
    console.log(req.body.info);
    let newUser = new User({
      name: req.body.info.name,
      phone: req.body.info.phone,
      email: req.body.info.email,
      address: req.body.info.address,
      username: req.body.info.uid,
      permission: req.body.info.permission
    });
    console.log(newUser);
    const registeredUser = await User.register(newUser, req.body.info.password);
    Otp.findOneAndRemove({ _id: req.body.deletable }, (err, docs) => {
      if (err) console.log(err);
      else console.log("Removed User: ", docs);
    });
    res.json({
      res: "success",
      data: registeredUser,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      res: "error",
      error: e,
    });
  }
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  try {
    res.json({
      res: "success",
      data: req.user,
    });
  } catch (e) {
    res.status(500).json({
      res: "error",
      error: e,
    });
  }
});

router.post("/user", async (req, res) => {
  const user = await User.findOne({ _id: req.body.user });
  res.json({
    res: "success",
    data: user,
  });
});


router.post("/details", async(req,res)=>{
  console.log(req.body.id);
  const reqUser = await User.findOne({_id: req.body.id})
  if(reqUser)
  res.json({
    res: "success",
    data: reqUser
  })
  else
  res.json({
    res: "blank"
  })
})


router.post("/updateDetails", async(req,res)=>{
  try{
    const doc = await User.updateOne({_id: req.body.data.id},{
      name: req.body.data.name,
      phone: req.body.data.phone,
      address: req.body.data.address,
      email: req.body.data.email
    })
    const user = await User.findOne({_id: req.body.data.id})
    res.json({
      res: "success",
      data: user
    })
  }
  catch(e){
    res.status(500).json({
      res: "error",
      error: e
    })
  }
})
module.exports = router;
