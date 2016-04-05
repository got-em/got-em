var express = require('express');
var router = express.Router();
var sounds = require('../lib/sounds');

router.get('/', function(req, res, next) {
  var soundsGroup = [];
  var groupSize = 4;
  for(var i = 0; i < sounds.length; i += groupSize){
    soundsGroup.push(sounds.slice(i, i + groupSize));
  }
  res.render('index', { soundsGroup });
});

module.exports = router;
