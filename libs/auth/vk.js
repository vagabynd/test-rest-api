const VKontakteStrategy = require('passport-vkontakte').Strategy;
var passport = require('passport');

var libs = process.cwd() + '/libs/';

var config = require(libs + 'config');
var log = require(libs + 'log/log')(module);

var dataModels = process.cwd() + '/dataModels/';
var User = require(dataModels + 'user');

var AccessToken = require(dataModels +'accessToken');
var RefreshToken = require(dataModels +'refreshToken');

passport.use(new VKontakteStrategy(
    {
        clientID:     6084066, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: 'RnZI4W5kcn8oXDV51Jgo',
        callbackURL:  'http://localhost:3000/auth/vkontakte/callback'
    },
    function myVerifyCallbackFn(accessToken, refreshToken, params, profile, done) {

        // Now that we have user's `profile` as seen by VK, we can
        // use it to find corresponding database records on our side.
        // Also we have user's `params` that contains email address (if set in
        // scope), token lifetime, etc.
        // Here, we have a hypothetical `User` class which does what it says.


        //здесь необходимо описать всю логику работы с токеном вк, его проверку на просроченность, его обновление при повторной авторизации, добавить выход

        var user = new User({
            userID: 'vk_' + profile.id,
            firstName: profile.displayName.split(" ")[0],
            lastName: profile.displayName.split(" ")[1]
        });

        var _accessToken = new AccessToken({
            userId: profile.id,
            clientId: '6084066',
            token: accessToken
        });

        _accessToken.save(function(err, accessToken) {
            if(!err && !accessToken.length) {
                log.info("New access token from VK saved - for user: " + accessToken.userId);
            }else if(err)  {
                log.error(err);
                return done(null, user);
            }
        });

        user.save(function(err, user) {
            if(!err && !user.length) {
                log.info("New user - id: " + user.userID);
                return done(null, user);
            }else if(err)  {
                log.error(err);
                return done(null, user);
            }
        });
    }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
//хз что это нужно разобрать
passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function (user) { done(null, user); })
        .catch(done);
});