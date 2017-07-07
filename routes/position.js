var express = require('express');
var router = express.Router();

var dataModels = process.cwd() + '/dataModels/';
var curPos = require(dataModels + 'curPos');


router.get('/:userid', function(req, res, next) {
    //user position
});

router.put('/:userid', function(req, res, next) {
    //update user position
});

module.exports = router;
