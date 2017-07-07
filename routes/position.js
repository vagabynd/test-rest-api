var express = require('express');
var router = express.Router();

var dataModels = process.cwd() + '/dataModels/';
var curLoc = require(dataModels + 'curLoc').CurLoc;

router.get('/:userid', function(req, res, next) {
   curLoc.findOne({userID: req.param('userid')}, '-_id current_position', function(err, user, next) {

        if (err) {
            return next(err);
        }

        if (!user) {
            return next(null, false, { message: 'Unknown user' });
        }
        else res.json(user.current_position);
    });
});

router.put('/:userid', function(req, res, next) {
    //update user position
});

module.exports = router;
