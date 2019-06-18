const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const router = express.Router();

const logger = require('../config/logger');
const { checkUserToken, checkAdminToken, signToken } = require('../middleware/jwt');
const User = require('../model//User');

const saltRounds = 10;

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/* routes open to public */
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  if (!email || !password) {
    return res.status(409).send({
      message: 'Email and password are required for register.',
      success: false,
    });
  }
  return User.find({ email })
    .then((found) => {
      if (found.length > 0) {
        logger.info(`Try to register existing user with email: ${email}`);
        return res.status(403).send({
          message: `User with email ${email} already exists.`,
          success: false,
        });
      }
      return bcrypt.hash(password, saltRounds)
        .then((hash) => User.create({
          username,
          email,
          password: hash,
        }));
    })
    .then((user) => {
      res.status(200).send({ user, success: true });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send({
        message: `Fail to add user. Error: ${err}`,
        success: false,
      });
    });
});

router.post('/login', (req, res) => {
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    return res.status(409).send('Email(or username) and password are required for login.');
  }
  return User
    .findOne({ $or: [{ username }, { email }] })
    .then((found) => {
      if (!found) {
        logger.info(`No user with email: ${email}`);
        return res.status(404).send({
          message: 'User not found.',
          success: false,
        });
      }
      return bcrypt.compare(password, found.password)
        .then((isHashMatch) => {
          if (isHashMatch) {
            logger.info(`User loggedin with email: ${email}`);
            const token = signToken({
              email, username, admin: found.admin, id: found._id,
            });
            return res.status(200).send({
              success: true,
              token: `Bearer ${token}`,
              id: found._id,
            });
          }
          logger.info(`Wrong email or password: ${email}`);
          return res.status(403).send('Wrong email or password.');
        });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send('Error when authenticating user.');
    });
});

/* routes require user authentication */
router.get('/id/:id', checkUserToken, (req, res) => {
  return User
    .findById(req.params.id).select('-password')
    .then((user) => {
      if (!user) return res.status(404).send('No user found.');
      return res.status(200).send({ user, success: true });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send({
        message: 'Error when finding the users.',
        success: false,
      });
    });
});

router.delete('/id/:id', checkUserToken, (req, res) => {
  return User
    .findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) return res.status(404).send('No user found.');
      return res.status(200).send({
        success: true,
        message: `User with id ${user._id} was deleted.`,
      });
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({
        message: 'Error when deleting the user.',
        success: false,
      });
    });
});

router.put('/id/:id', checkUserToken, (req, res) => {
  return User
    .findOne({ email: req.body.email })
    .then((duplicatedEmail) => {
      if (duplicatedEmail) {
        return res.status(403).send({
          message: 'A user with this email already exists.',
          success: false,
        });
      }
      return User
        .findByIdAndUpdate(req.params.id, req.body, { new: true })
        .select('-password')
        .then((user) => {
          return res.status(200).send({ user, success: true });
        })
        .catch((err) => {
          logger.error(err.message);
          return res.status(500).send({
            message: 'Error when updating the user.',
            success: false,
          });
        });
    })
    .catch((err) => {
      logger.error(err.message);
      return res.status(500).send({
        message: 'Error when querying the user.',
        success: false,
      });
    });
});

/* routes require admin authentication */
router.get('/all', checkAdminToken, (req, res) => {
  return User
    .find({}).select('-password')
    .then((users) => {
      res.status(200).send({ users, success: true });
    })
    .catch((err) => {
      logger.error(err.message);
      res.status(500).send({
        message: 'Error finding the users.',
        success: false,
      });
    });
});

module.exports = router;
