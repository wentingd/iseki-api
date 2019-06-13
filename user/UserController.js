const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const router = express.Router();


const logger = require('../config/logger');
const User = require('./User');

const saltRounds = 10;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).send('Email and password are required for register.');
  }
  return User.find({ email })
    .then((found) => {
      if (found.length > 0) {
        logger.info(`Try to register existing user with email: ${req.body.email}`);
        return res.status(403).send(`User with email ${email} already exists.`);
      }
      return bcrypt.hash(req.body.password, saltRounds)
        .then((hash) => User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
        }));
    })
    .then((user) => {
      res.status(200).send(`User registered successfully. id: ${user._id}`);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send(`Fail to add user. Error: ${err}`);
    });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(409).send('Email(or username) and password are required for login.');
  }
  return User.find({ email })
    .then((found) => {
      if (!found || found.length <= 0) {
        logger.info(`No user with email: ${email}`);
        return res.status(404).send('No user found.');
      }
      return bcrypt.compare(password, found[0].password)
        .then((isHashMatch) => {
          if (isHashMatch) {
            return res.status(200).send(`User logged in successfully. id: ${found[0]._id}`);
          }
          return res.status(403).send('Wrong email or password.');
        });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send('Error when checking user login.');
    });
});

router.get('/', (req, res) => {
  return User
    .find({}).select('name email')
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send('Error finding the users.');
    });
});

router.get('/:id', (req, res) => {
  return User
    .findById(req.params.id).select('name email')
    .then((user) => {
      if (!user) return res.status(404).send('No user found.');
      return res.status(200).send(user);
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send('Error when finding the users.');
    });
});

router.delete('/:id', (req, res) => {
  return User
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send('No user found.');
      return res.status(200).send(`User with id ${user._id} was deleted.`);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send('Error when deleting the user.');
    });
});

router.put('/:id', (req, res) => {
  return User
    .findByIdAndUpdate(req.params.id, req.body, { new: true })
    .select('name email')
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send('Error when updating the user.');
    });
});

module.exports = router;
