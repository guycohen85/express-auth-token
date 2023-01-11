const logger = require('../utils/logger');
const { extractErrors } = require('../utils/joiError');

module.exports = (app) => {
  app.use(async (err, req, res, next) => {
    const error = { message: err.message };

    // Only providing stack error in development
    if (process.env.NODE_ENV === 'development') {
      error.stack = err.stack;
    }

    // JOI errors
    if (err.details) {
      error.details = extractErrors(err.details);
    }

    // Log error
    logger.error(`${error.message} ${error.stack ? error.stack : ''}`);

    res.status(err.status || 500).json({ error });
  });
};
