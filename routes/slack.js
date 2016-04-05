var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  var requestedSound = req.body.text;
  res.redirect('sounds/' + requestedSound);
});

module.exports = router;
