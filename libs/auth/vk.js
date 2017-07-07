const VKontakteStrategy = require('passport-vkontakte').Strategy;
var passport = require('passport');
var crypto = require('crypto');
var libs = process.cwd() + '/libs/';

var config = require(libs + 'config');
var log = require(libs + 'log/log')(module);

var dataModels = process.cwd() + '/dataModels/';
var User = require(dataModels + 'user').User;

var AccessToken = require(dataModels +'accessToken');
var RefreshToken = require(dataModels +'refreshToken');
var oauth2 = require('./oauth2');

var errFn = function (cb, err) {
    if (err) {
        return cb(err);
    }
};


passport.use(new VKontakteStrategy(
    {
        clientID:     6084066, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
        clientSecret: config.get('vk_secret'),
        callbackURL:  'http://localhost:3000/auth/vkontakte/callback'
    },
    function myVerifyCallbackFn(accessToken, _refreshToken, params, profile, done) {

        // Now that we have user's `profile` as seen by VK, we can
        // use it to find corresponding database records on our side.
        // Also we have user's `params` that contains email address (if set in
        // scope), token lifetime, etc.
        // Here, we have a hypothetical `User` class which does what it says.

        var errorHandler = errFn.bind(undefined, done),
            refreshToken,
            refreshTokenValue,
            token,
            tokenValue;

        var data  = {
            userId: 'vk_' + profile.id,
            clientId: '6084066'
        };
        var user = new User({
            userID: 'vk_' + profile.id,
            firstName: profile.displayName.split(" ")[0],
            lastName: profile.displayName.split(" ")[1]
        });

        RefreshToken.remove(data, errorHandler);
        AccessToken.remove(data, errorHandler);
        User.remove({userID: 'vk_' + profile.id }, errorHandler);

        tokenValue = crypto.randomBytes(32).toString('hex');
        refreshTokenValue = crypto.randomBytes(32).toString('hex');

        data.token = tokenValue;
        data.vk_token = accessToken;
        token = new AccessToken(data);
        delete(data.vk_token);
        data.token = refreshTokenValue;
        refreshToken = new RefreshToken(data);

        refreshToken.save(errorHandler);

        user.save(errorHandler);



        token.save(function (err) {
            if (err) {

                log.error(err);
                return done(err);
            }
            var tokenInfo = {
                'access_token': token.token,
                'expires_in': config.get('security:tokenLife'),
                'refresh_token': refreshToken.token,
                'token_type': "Bearer"
            };

            done(null, {user: user, token: tokenInfo});
        });

        //здесь необходимо описать всю логику работы с токеном вк, его проверку на просроченность, его обновление при повторной авторизации, добавить выход

    }
));

// User session support for our hypothetical `user` objects.
passport.serializeUser(function(user, done) {
    done(null, user.user.userID);
});
//хз что это нужно разобрать
passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then(function (user) { done(null, user); })
        .catch(done);
});