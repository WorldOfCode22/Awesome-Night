const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  goingTo: Array
});

const Bar = new Schema({
  yelpId: String,
  usersGoing: Number,
})

module.exports.User = User;
module.exports.Bar = Bar;
