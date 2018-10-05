const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  password: String
});

mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');
