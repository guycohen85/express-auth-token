const createError = require('http-errors');

function admin(req, res, next) {
  if (!req.user.roles?.includes('admin')) {
    return next(createError(403, 'Access denied.'));
  }

  next();
}

module.exports = admin;
