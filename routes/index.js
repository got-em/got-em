var express = require('express');
var router = express.Router();
var getSounds = require('../lib/sounds');
var sounds = getSounds();

module.exports = io => {
  router.get('/', function(req, res, next) {
    res.render('index');
  });

  router.get('/room/:room_id', function(req, res, next) {
    var reg = /^[a-zA-Z0-9]+$/;
    if (!reg.test(req.params.room_id)) {
      res.redirect('/');
    } else {
      res.render('room', {
        roomId: req.params.room_id
      });
    }
  });

  router.get('/lobby', function(req, res, next) {
    res.render('lobby');
  });

  io.on('connection', function(socket) {
    socket.emit('load', sounds);
  });

  return router;
};
