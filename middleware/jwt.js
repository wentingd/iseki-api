const jwt = require('jsonwebtoken');
const config = require('./config.js');

const isSameUser = (req, decodedJwt) => {
  const { id, email } = decodedJwt;
  if (req.params.id) {
    return req.params.id === id;
  }
  return req.body.email === email;
};

const signToken = (payload) => {
  const token = jwt.sign({
    ...payload,
  }, config.secret);
  return token;
};

const checkUserToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    return jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid auth token.',
        });
      }
      if (!isSameUser(req, decoded)) {
        return res.json({
          success: false,
          message: 'Token valid for another user.',
        });
      }
      req.decoded = decoded;
      return next();
    });
  }
  return res.json({
    success: false,
    message: 'Auth token is not supplied',
  });
};

const checkAdminToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  if (token) {
    return jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Invalid auth token.',
        });
      }
      if (!decoded.admin) {
        return res.json({
          success: false,
          message: 'Not valid admin user.',
        });
      }
      req.decoded = decoded;
      return next();
    });
  }
  return res.json({
    success: false,
    message: 'Auth token is not supplied',
  });
};

module.exports = {
  checkUserToken,
  checkAdminToken,
  signToken,
};
