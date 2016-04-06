const express = require('express');
const router = express.Router();

module.exports = io => {

  router.post('/', function(req, res, next) {
    if (req.body && req.body.message && req.body.voice) {
      io.emit('speech', { message: req.body.message, voice: req.body.voice });
      return res.status(200).json({ status: 'ok', message: req.body.message });
    } else {
      return res.status(500).json({ status: 'failed', message: 'speech requires "message"' });
    }
  });

  return router;
};
