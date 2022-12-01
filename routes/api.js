const express = require('express');
const apiRouter = express.Router();
const auth = require('../middleware/auth');

const authRouter = require('./api/auth');
const userRouter = require('./api/user');

apiRouter.use('/', authRouter);
apiRouter.use('/', auth, userRouter);

apiRouter.post('/protected', auth, (req, res, next) => {
  res.json({ protected: 'protected' });
});

module.exports = apiRouter;
