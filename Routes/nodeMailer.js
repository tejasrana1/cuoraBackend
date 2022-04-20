const router = require("express").Router();
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tejasrana7771@gmail.com",
    pass: "Tripwire@1",
  },
});

const Otp = require("../Models/Otp");
router.post("/email_after_otp", async (req, res) => {
  console.log(req.body.id);
  const email = await Otp.findOne({ _id: req.body.id });
  if (email)
    res.json({
      res: "success",
      data: email.email,
    });
  else
    res.json({
      res: "not_found",
    });
});
const e = require("express");
function se(email, otp) {
  var mailOptions = {
    from: "tejasrana7771@gmail.com",
    to: email,
    subject: "One Time Password For Cuora",
    html: `<div><strong><span style="color:red;">${otp}</span></strong> is the OTP for Cuora Login. OTPs are secret. Therefore, do not disclose this to anyone</div>`,
  };

  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else {
      console.log("Email Sent: " + info.response);
      const newOtp = new Otp({
        email: email,
        otp: otp,
      });
      newOtp.save();
    }
  });
}

router.post("/", async (req, res) => {
  const otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
  let alreadyAdded = await Otp.findOne({ email: req.body.email });
  console.log(alreadyAdded);
  if (!alreadyAdded) {
    se(req.body.email, otp);
    res.json({
      res: "success",
    });
  } else
    res.json({
      res: "already exist",
    });
  console.log(req.body.email);
  console.log(otp);
});

router.post("/otp_validation", async (req, res) => {
  const user = await Otp.findOne({ email: req.body.email });
  var status = "";
  console.log(user.otp);
  if (user) {
    if (user.otp === req.body.otp) status = "matched";
    else status = "not matched";
  } else status = "no user";
  res.json({
    res: status,
    id: user._id,
  });
  console.log(req.body.email);
  console.log(req.body.otp);
});

module.exports = router;
