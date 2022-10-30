const debug = require('debug')('app:router');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  debug('booting');
  res.render('index', { title: 'Express' });
});

module.exports = router;
