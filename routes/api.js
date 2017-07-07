var express = require('express');
var router = express.Router();
var passport = require('passport');

var ws = require('../libs/websocket/ws');


/* old websocket example  */
/*router.get('/:name', function(req, res, next) {
  ws.connections[0].send(req.params['name']);
  res.send('hi, ' + req.params['name']  +  ' i\'m api');
});*/

router.get('/', passport.authenticate('bearer', {session: false}), function (req, res) {
    res.json({
        msg: 'API is running'
    });
});

module.exports = router;
