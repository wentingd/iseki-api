const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
require('./db');

const app = express();

const UserController = require('./User/UserController');
const TrainLineController = require('./Trains/TrainLineController');
const StationController = require('./Trains/StationController');

app.use(morgan('combined', { stream: logger.stream }));

app.use('/users', UserController);
app.use('/trains/lines', TrainLineController);
app.use('/trains/stations', StationController);

module.exports = app;
