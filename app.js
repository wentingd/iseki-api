const express = require('express');
const app = express();
const db = require('./db');

const UserController = require('./User/UserController');
const TrainLineController = require('./Trains/TrainLineController');
const StationController = require('./Trains/StationController');

app.use('/users', UserController);
app.use('/trains/lines', TrainLineController);
app.use('/trains/stations', StationController);

module.exports = app;
