const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "tejasrana7771@gmail.com",
    pass: "Tripwire@1",
  },
});

var mailOptions = {
  from: "tejasrana7771@gmail.com",
  to: "tejasranaofficial@gmail.com",
  subject: "first mail for testing",
  text: "Hello!!! This is first mail",
};

function se() {
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) console.log(err);
    else console.log("Email Sent: " + info.response);
  });
}

se();
