const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type : "String"
  },
  email: {
    type : "String",
    unique : true
  },
  password: {
    type : "String",
    required : true
  }
});

users = mongoose.model("User", userSchema);

module.exports = users