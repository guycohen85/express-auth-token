const apiRouter = require('../routes/api');
const webRouter = require('../routes/web');

module.exports = (app) => {
  app.use('/api', apiRouter);
  app.use('/', webRouter);
};
