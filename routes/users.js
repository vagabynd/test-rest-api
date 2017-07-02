var express = require('express');
var router = express.Router();

var dataModels = process.cwd() + '/dataModels/';
var User = require(dataModels + 'user');

/* GET users listing. */
router.get('/:userid', function(req, res, next) {User.findOne({userID: req.param('userid')}, function(err, user) {

      if (err) {
          return next(err);
      }

      if (!user) {
          return next(null, false, { message: 'Unknown user' });
      }
      else res.json(user);
  });
});

router.put('/', function(req, res, next) {
    var data = req.body;
});

module.exports = router;
