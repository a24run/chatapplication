var express = require('express');

var router = express.Router();

router.get('/', function(req, res) {
  res.send("in chat");
});
module.exports = router;
