const mongoose = require('mongoose');

const StationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const TrainLineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  stations: [StationSchema],
});

mongoose.model('Station', StationSchema);
mongoose.model('TrainLine', TrainLineSchema);

module.exports = {
  TrainLine: mongoose.model('TrainLine'),
  Station: mongoose.model('Station'),
};
