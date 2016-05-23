var express = require('express');
var router = express.Router();
var sounds = require('../lib/sounds');
var soundsGroup = [];
var groupSize = 4;
for(var i = 0; i < sounds.length; i += groupSize){
  soundsGroup.push(sounds.slice(i, i + groupSize));
}

module.exports = io => {
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/room/:room_id', function(req, res, next) {
    res.render('room', { soundsGroup });
  });

  return router;
};
