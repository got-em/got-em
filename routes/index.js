var express = require('express');
var router = express.Router();
var sounds = require('../lib/sounds');

router.get('/', function(req, res, next) {
  res.render('index', { sounds });
});

module.exports = router;
