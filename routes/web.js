const express = require('express');
const webRouter = express.Router();

const homeRouter = require('./web/home');

webRouter.use('/', homeRouter);

module.exports = webRouter;
