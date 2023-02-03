const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  
  email: {
    type : String,
    required : true
  },
  pizzaIds: [{
    type : [Number],
    required : true
  }],
  status: {
    type : String,
    default : "placed"
  },
  date: {
    type: Date,
    default: Date.now
}
});

users = mongoose.model("Order", orderSchema);

module.exports = users