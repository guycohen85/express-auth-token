const express = require('express');
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
require('./startup/db')();

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

if (process.env.NODE_ENV === 'development') {
  require('./startup/cors')(app);
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./startup/morgan')(app);

require('./startup/routes')(app);

require('./middleware/not-found')(app);
require('./middleware/error')(app);

module.exports = app;
