const express = require('express');
const apiRouter = express.Router();

const authRouter = require('./api/auth');

apiRouter.use('/', authRouter);

module.exports = apiRouter;
