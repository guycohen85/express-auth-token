const config = require('config');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const expiresIn = '1y';

function createAccessToken(payload = {}) {
  return jwt.sign(payload, config.get('jwtSecret'), {
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
  return jwt.verify(token, config.get('jwtSecret'));
}

module.exports = {
  createAccessToken,
  createRefreshToken,
  extractHeaderToken,
  validateToken,
};
