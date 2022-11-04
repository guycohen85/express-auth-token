const indexRouter = require('../routes/index');
// const usersRouter = require('../routes/users');
const authRouter = require('../routes/auth');

module.exports = (app) => {
  app.use('/', indexRouter);
  // app.use('/users', usersRouter);
  app.use('/', authRouter);
};
