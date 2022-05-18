const mongoose = require("mongoose");

const namespaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  messages: {
    type: Array
  }
});

module.exports = mongoose.model("Namespace", namespaceSchema);
