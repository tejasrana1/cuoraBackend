const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  address: {
    required: true,
    type: String,
  },
  permission: {
    required: true,
    type: String
  },
  namespaces: []
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
