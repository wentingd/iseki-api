const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const Station = require('./Train').Station;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
  Station.find(req.body.id).then(result => {
    console.log(result);
  })
  if (!req.body.name) {
    return res.status(500).send("Name is required.");
  }
  Station.create({
    id : req.body.id,
    name : req.body.name
  },
  function (err, station) {
      if (err) return res.status(500).send(err);
      res.status(200).send(station);
  });
});

router.get('/', function (req, res) {
    Station.find({}, function (err, stations) {
        if (err) return res.status(500).send("There was a problem finding the stations.");
        res.status(200).send(stations);
    });
});

router.get('/:id', function (req, res) {
    Station.findById(req.params.id, function (err, station) {
        if (err) return res.status(500).send("There was a problem finding the station.");
        if (!station) return res.status(404).send("No station found.");
        res.status(200).send(station);
    });
});

router.delete('/:id', function (req, res) {
    Station.findByIdAndRemove(req.params.id, function (err, station) {
        if (err) return res.status(500).send("There was a problem deleting the station.");
        res.status(200).send("Station: "+ station.name +" was deleted.");
    });
});

router.put('/:id', function (req, res) {
    Station.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, station) {
        if (err) return res.status(500).send("There was a problem updating the station.");
        res.status(200).send(station);
    });
});

module.exports = router;
