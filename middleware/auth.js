const createError = require('http-errors');
const { extractHeaderToken, validateToken } = require('../utils/tokens');

function auth(req, res, next) {
  [token, error] = extractHeaderToken(req);

  if (error) {
    return next(createError(401, error.message));
  }

  const errorValidation = validateToken(token);

  if (errorValidation) {
    return next(createError(401, errorValidation.message));
  }

  next();
}

module.exports = auth;
