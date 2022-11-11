const createError = require('http-errors');
const { extractHeaderToken, validateToken } = require('../utils/tokens');

function auth(req, res, next) {
  [token, error] = extractHeaderToken(req);

  if (error) {
    return next(createError.Unauthorized());
  }

  const errorValidation = validateToken(token);

  if (errorValidation) {
    return next(createError.Unauthorized());
  }

  next();
}

module.exports = auth;
