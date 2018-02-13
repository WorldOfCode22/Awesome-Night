const mongoose = require('mongoose');
const Schema = mongoose.Scheam;

const User = new Schema({
  goingTo: Array
});

const Bar = new Schema({
  yelpId: String,
  usersGoing: Number,
})

module.exports.User = User;
module.exports.Bar = Bar;
