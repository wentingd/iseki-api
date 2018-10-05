const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const TrainLine = require('./Train').TrainLine;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/', function (req, res) {
  if (!req.body.name) {
    return res.status(500).send("Name is required.");
  }
  TrainLine.create({
    id: req.body.id,
    name : req.body.name
  },
  function (err, trainLine) {
      if (err) return res.status(500).send(err);
      res.status(200).send(trainLine);
  });
});

router.get('/', function (req, res) {
    TrainLine.find({}, function (err, trainLines) {
        if (err) return res.status(500).send("There was a problem finding the trainLines.");
        res.status(200).send(trainLines);
    });
});

router.get('/:id', function (req, res) {
    TrainLine.findById(req.params.id, function (err, trainLine) {
        if (err) return res.status(500).send("There was a problem finding the trainLine.");
        if (!trainLine) return res.status(404).send("No trainLine found.");
        res.status(200).send(trainLine);
    });
});

router.delete('/:id', function (req, res) {
    TrainLine.findByIdAndRemove(req.params.id, function (err, trainLine) {
        if (err) return res.status(500).send("There was a problem deleting the trainLine.");
        res.status(200).send("TrainLine: "+ trainLine.name +" was deleted.");
    });
});

router.put('/:id', function (req, res) {
    TrainLine.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, trainLine) => {
      if (req.body.name !== trainLine.name) {
        return res.status(500).send("Cannot update to different name.");
      }
      if (err) return res.status(500).send("There was a problem updating the trainLine.");
      res.status(200).send(trainLine);
    });
});

module.exports = router;
