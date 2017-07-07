var express = require('express');
var router = express.Router();

var dataModels = process.cwd() + '/dataModels/';
var curReq = require(dataModels + 'curReq');


router.get('/:userId', function(req, res, next) {
    //get user req
});

router.get('/pos/:posXY/radius/:rad', function(req, res, next) {
    //get all req from pos with radius
});

router.put('/reqId', function(req, res, next) {
    //edit user req
});

router.delete('/:reqId', function(req, res, next) {
    //delete user req
});

module.exports = router;
