var express = require('express');
var router = express.Router();

var ws = require('../libs/websocket/ws');


/* GET users listing. */
router.get('/:name', function(req, res, next) {
  ws.connections[0].send(req.params['name']);
  res.send('hi, ' + req.params['name']  +  ' i\'m api');
});

module.exports = router;
