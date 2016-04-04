const express = require('express');
const router = express.Router();

const sounds = require('../lib/sounds');

module.exports = io => {
  // broadcast list of sounds
  io.on('connection', function(socket) {
    socket.emit('load', sounds);
  });

  router.get('/', function(req, res, next) {
    res.redirect('/');
  });

  // expose routes per sound
  sounds.forEach((sound) => {
    router.get(`/${sound}`, function(req, res, next) {
      io.emit('play', sound);
      return res.status(200).json({ status: 'ok' });
    });
  });

  return router;
};
