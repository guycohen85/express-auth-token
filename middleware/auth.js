const createError = require('http-errors');
const { extractHeaderToken, validateToken } = require('../utils/tokens');

function auth(req, res, next) {
  [token, error] = extractHeaderToken(req);

  if (error) {
    return next(createError(401, error.message));
  }

  const tokenData = validateToken(token);

  if (tokenData instanceof Error) {
    return next(createError(401, tokenData.message));
  }

  next();
}

module.exports = auth;
