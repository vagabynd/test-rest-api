var express = require('express');
var passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;
var libs = process.cwd() + '/libs/';

var oauth2 = require(libs + 'auth/oauth2');
var log = require(libs + 'log/log')(module);
var	router = express.Router();

router.get('/',
    passport.authenticate('vkontakte'),
    function(req, res, next) {
});

router.get('/callback',
    passport.authenticate('vkontakte', {failureRedirect: '/login'}),
    function (req, res, next) {

        res.json(req.user.token);
});

router.get('/check',
    ensureAuthenticated,
    function(req, res, next) {
        res.redirect('/');
        return next();
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    else {
        res.redirect('/');
    }
}
module.exports = router;