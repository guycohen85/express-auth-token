const express = require('express');
const apiRouter = express.Router();
const auth = require('../middleware/auth');

const authRouter = require('./api/auth');

apiRouter.use('/', authRouter);

apiRouter.get('/protected', auth, (req, res, next) => {
  res.json({ protected: 'protected' });
});

apiRouter.get('/open', (req, res, next) => {
  res.json({ open: 'open' });
});

module.exports = apiRouter;
