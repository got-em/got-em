const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const soundDir = path.join(__dirname,'..', 'public', 'sounds');
const sounds = fs.readdirSync(soundDir).map((file) => {
  return file.split('.')[0];
});

module.exports = io => {
  // broadcast list of sounds
  io.on('connection', function(socket) {
    socket.emit('load', sounds);
  });

  // soundboard
  router.get('/', function(req, res, next) {
    res.render('soundboard', { sounds });
  });

  // expose routes per sound
  sounds.forEach((sound) => {
    console.log(`Loaded ${sound}!`);
    router.get(`/${sound}`, function(req, res, next) {
      io.emit('play', sound);
      return res.status(200).json({ status: 'ok' });
    });
  });

  return router;
};
