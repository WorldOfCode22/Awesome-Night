const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
  goingTo: Array
});

const Bar = new Schema({
  yelpId: String,
  usersGoing: Array,
})

module.exports.User = mongoose.model('user',User);
module.exports.Bar = mongoose.model('bar', Bar);
