const express = require('express');
const router = express.Router();

var getSounds = require('../lib/sounds');
var sounds = getSounds('all');

module.exports = io => {
  router.get('/', function(req, res, next) {
    res.redirect('/');
  });

  // expose routes per sound
  sounds.forEach((sound) => {
    router.get(`/${sound.name}`, function(req, res, next) {
      var room = req.query.room;
      io.to(room).emit('play', sound.name, sound.directory);
      return res.status(200).json({ status: 'ok' });
    });
  });

  return router;
};
