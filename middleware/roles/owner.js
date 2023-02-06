const createError = require('http-errors');

function owner(req, res, next) {
  if (req.user._id === req.params.id || req.user.roles?.includes('admin')) {
    return next();
  }
  return next(createError(403, 'Access denied.'));
}

module.exports = owner;
