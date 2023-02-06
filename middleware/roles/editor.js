const createError = require('http-errors');

function editor(req, res, next) {
  console.log(req.user);
  if (!req.user.roles?.includes('editor') && !req.user.roles?.includes('admin')) {
    return next(createError(403, 'Access denied.'));
  }

  next();
}

module.exports = editor;
