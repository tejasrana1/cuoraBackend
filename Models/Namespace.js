const mongoose = require("mongoose");

const namespaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Namespace", namespaceSchema);
