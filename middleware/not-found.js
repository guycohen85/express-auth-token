const createError = require('http-errors');

module.exports = (app) => {
  app.use((req, res, next) => {
    next(createError(404));
  });
};
