var express = require('express');
var router = express.Router();

var dataModels = process.cwd() + '/dataModels/';
var curDlg = require(dataModels + 'curDlg');


router.get('/get/:dialog/:lastMsgId', function (req, res, next) {
    res.send("i'm sending messages from dialog with id: " + req.param['dialog'] + "starting from message with id: " + req.param['lastMsgId']);
});

router.get('/getDialogs/:userId/:lastDlgId', function (req, res, next) {
    res.send("i'm sending list of dialogs from user with id: " + req.param('userId') + "starting from dialog with id: " + req.param('lastDlgId'));

});

router.delete('/deleteMsg', function (req, res, next) {
    var ids = req.query.ids.split(',');
    var _ids = "";

    for (var i in ids){
        if (ids.hasOwnProperty(i)){
            _ids += ids[i] + " ";
        }
    }
    res.send("i'm deleting messages with id's: " + _ids);
});

router.delete('/deleteDlg/:id', function (req, res, next) {
    res.send("i'm deleting dialog with id: " + req.param['id']);
});

router.post('/send/', function (req, res, next) {
    res.send("i'm sending message: " + req.body);
});

router.post('/rate/:answerId', function (req, res, next) {
    //like/dislike answer
});

module.exports = router;
