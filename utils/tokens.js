const config = require('config');
const jwt = require('jsonwebtoken');

function getAccessToken(payload) {
  return jwt.sign(payload, config.get('jwtSecret'), {
    expiresIn: '15m',
  });
}

function getRefreshToken() {
  return jwt.sign({}, config.get('jwtSecret'), {
    expiresIn: '15 days',
  });
}

module.exports = { getAccessToken, getRefreshToken };
