const createError = require('http-errors');
const { extractHeaderToken, validateToken } = require('../utils/tokens');

function auth(req, res, next) {
  [token, error] = extractHeaderToken(req);

  if (error) {
    return next(createError(401, error.message));
  }

  try {
    const tokenData = validateToken(token);
    req.user = tokenData;
    next();
  } catch (error) {
    return next(createError(401, error.message));
  }
}

module.exports = auth;
