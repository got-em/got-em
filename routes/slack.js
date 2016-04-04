var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
    console.log(req.body.text)
    var requested_sound = req.body.text
    res.redirect('sounds/' + requested_sound);
});

module.exports = router;
