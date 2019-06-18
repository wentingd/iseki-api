const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();

const { Station } = require('../model/Train');
const logger = require('../config/logger');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', (req, res) => {
  if (!req.body.name) {
    return res.status(500).send('Name is required.');
  }
  Station
    .find(req.body.id)
    .then((result) => {
      logger.info(result);
    });
  Station.create({
    id: req.body.id,
    name: req.body.name,
  },
  (err, station) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(station);
  });
});

router.get('/', (req, res) => {
  Station.find({}, (err, stations) => {
    if (err) return res.status(500).send('There was a problem finding the stations.');
    res.status(200).send(stations);
  });
});

router.get('/:id', (req, res) => {
  Station.findById(req.params.id, (err, station) => {
    if (err) return res.status(500).send('There was a problem finding the station.');
    if (!station) return res.status(404).send('No station found.');
    res.status(200).send(station);
  });
});

router.delete('/:id', (req, res) => {
  Station.findByIdAndRemove(req.params.id, (err, station) => {
    if (err) return res.status(500).send('There was a problem deleting the station.');
    res.status(200).send(`Station: ${station.name} was deleted.`);
  });
});

router.put('/:id', (req, res) => {
  Station.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, station) => {
    if (err) return res.status(500).send('There was a problem updating the station.');
    res.status(200).send(station);
  });
});

module.exports = router;
