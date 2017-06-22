var oauth2orize = require('oauth2orize');
var passport = require('passport');
var crypto = require('crypto');

var libs = process.cwd() + '/libs/';

var config = require(libs + 'config');
var log = require(libs + 'log/log')(module);
var dataModels = process.cwd() + '/dataModels/';

var db = require(libs + 'db/db-mongdb');
var User = require(dataModels + 'user');
var Client = require(dataModels + 'client');
var AccessToken = require(dataModels +'accessToken');
var RefreshToken = require(dataModels +'refreshToken');



User.remove({}, function(err) {
    var user = new User({
        userID: config.get("default:user:username"),
        password: config.get("default:user:password")
    });

    user.save(function(err, user) {
        if(!err) {
            log.info("New user - %s:%s", user.userID, user.password);
        }else {
            return log.error(err);
        }
    });
});
Client.remove({}, function(err) {
	var clients = [];

    clients.push(new Client({
        name: config.get("default:client:name"),
        clientId: config.get("default:client:clientId"),
        clientSecret: config.get("default:client:clientSecret")
    }));
    clients.push(new Client({
        name: 'VK API',
        clientId: 6084066,
        clientSecret: "RnZI4W5kcn8oXDV51Jgo"
    }));

    for (var i in clients){
    	if (clients.hasOwnProperty(i) ){
            clients[i].save(function(err, client) {
                if(!err) {
                    log.info("New client - %s:%s", client.clientId, client.clientSecret);
                } else {
                    return log.error(err);
                }

            });
		}
	}


});
AccessToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});
RefreshToken.remove({}, function (err) {
    if (err) {
        return log.error(err);
    }
});


// create OAuth 2.0 server
var aserver = oauth2orize.createServer();

// Generic error handler
var errFn = function (cb, err) {
	if (err) { 
		return cb(err); 
	}
};

// Destroys any old tokens and generates a new access and refresh token
var generateTokens = function (data, done) {

	// curries in `done` callback so we don't need to pass it
    var errorHandler = errFn.bind(undefined, done), 
	    refreshToken,
	    refreshTokenValue,
	    token,
	    tokenValue;

    RefreshToken.remove(data, errorHandler);
    AccessToken.remove(data, errorHandler);

    tokenValue = crypto.randomBytes(32).toString('hex');
    refreshTokenValue = crypto.randomBytes(32).toString('hex');

    data.token = tokenValue;
    token = new AccessToken(data);

    data.token = refreshTokenValue;
    refreshToken = new RefreshToken(data);

    refreshToken.save(errorHandler);

    token.save(function (err) {
    	if (err) {
			
			log.error(err);
    		return done(err); 
    	}
    	done(null, tokenValue, refreshTokenValue, { 
    		'expires_in': config.get('security:tokenLife') 
    	});
    });
};

// Exchange username & password for access token.
aserver.exchange(oauth2orize.exchange.password(function(client, userID, password, scope, done) {
	
	User.findOne({ userID: userID }, function(err, user) {
		
		if (err) { 
			return done(err); 
		}
		
		if (!user || !user.checkPassword(password)) {
			return done(null, false);
		}

		var model = { 
			userId: user.userID,
			clientId: client.clientId 
		};

		generateTokens(model, done);
	});

}));

// Exchange refreshToken for access token.
aserver.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

	RefreshToken.findOne({ token: refreshToken, clientId: client.clientId }, function(err, token) {
		if (err) { 
			return done(err); 
		}

		if (!token) { 
			return done(null, false); 
		}

		User.findOne({userID: token.userId}, function(err, user) {
			if (err) { return done(err); }
			if (!user) { return done(null, false); }

			var model = { 
				userId: user.userID,
				clientId: client.clientId 
			};

			generateTokens(model, done);
		});
	});
}));

// token endpoint
//
// `token` middleware handles client requests to exchange authorization grants
// for access tokens.  Based on the grant type being exchanged, the above
// exchange middleware will be invoked to handle the request.  Clients must
// authenticate when making requests to this endpoint.

exports.token = [
	passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
	aserver.token(),
	aserver.errorHandler()
];
