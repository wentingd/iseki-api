const express = require('express');
const morgan = require('morgan');
const logger = require('./config/logger');
require('./db');

const app = express();

const UserController = require('./controllers/UserController');
const TrainLineController = require('./controllers/TrainLineController');
const StationController = require('./controllers/StationController');

app.use(morgan('combined', { stream: logger.stream }));

app.use('/user', UserController);
app.use('/line', TrainLineController);
app.use('/station', StationController);

app.get('*', (req, res) => {
  logger.error('Unexsting routes being accessed.');
  res.json({
    message: 'Trying to access unexisting routes.',
  });
});

app.post('*', (req, res) => {
  logger.error('Unexsting routes being accessed.');
  res.json({
    message: 'Trying to access unexisting routes.',
  });
});

module.exports = app;
