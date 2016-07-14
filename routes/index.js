var express = require('express');
var router = express.Router();
var getSounds = require('../lib/sounds');

module.exports = io => {
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/room/:room_id', function(req, res, next) {
    var addon = req.query.addon;
    var sounds = getSounds(addon);

    io.on('connection', function(socket) {
      socket.emit('load', sounds);
    });

    var soundsGroup = [];
    var groupSize = 4;
    for(var i = 0; i < sounds.length; i += groupSize){
      soundsGroup.push(sounds.slice(i, i + groupSize));
    }
    res.render('room', { soundsGroup });
  });

  router.get('/lobby', function(req, res, next) {
    res.render('lobby');
  });

  return router;
};
