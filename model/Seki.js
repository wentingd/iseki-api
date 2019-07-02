const mongoose = require('mongoose');

const SekiSchema = new mongoose.Schema({
  giver: {
    type: String,
    required: true,
  },
  taker: {
    type: String,
    required: false,
  },
});

mongoose.model('Seki', SekiSchema);

module.exports = mongoose.model('Seki');
