const config = require('config');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const expiresIn = '15m';

function createAccessToken(payload = {}) {
  return jwt.sign(payload, config.get('jwtSecret'), {
    expiresIn,
  });
}

function createUserAccessToken({ id, email, firstName, lastName }) {
  return jwt.sign({ id, email, firstName, lastName }, config.get('jwtSecret'), {
    expiresIn,
  });
}

function createRefreshToken(id) {
  return jwt.sign({ id }, config.get('jwtSecret'), {
    expiresIn: '7 days',
  });
}

function extractHeaderToken(req) {
  let error;
  let token;

  const authHeader = req.header('Authorization');

  if (authHeader) {
    token = authHeader.split(' ')[1];
  } else {
    error = new Error('No token provided');
  }

  return [token, error];
}

function validateToken(token) {
  let value, error;

  try {
    value = jwt.verify(token, config.get('jwtSecret'));
  } catch (err) {
    error = err;
  }

  return [value, error];
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  createUserAccessToken,
  extractHeaderToken,
  validateToken,
};
