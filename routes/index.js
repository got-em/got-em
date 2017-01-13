var express = require('express');
var router = express.Router();
var getSounds = require('../lib/sounds');
var sounds = getSounds();

module.exports = io => {
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/room/:room_id', function(req, res, next) {
    res.render('room', { soundsGroup });
  });

  router.get('/soundlist', function(req, res, next) {
    res.send(sounds);
  });

  router.get('/lobby', function(req, res, next) {
    res.render('lobby');
  });

  io.on('connection', function(socket) {
    socket.emit('load', sounds);
  });

  return router;
};
