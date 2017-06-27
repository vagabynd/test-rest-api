var mongoose = require('./libs/db/mongoose');
var async = require('async');
var faker = require('faker/locale/ru');
var crypto = require('crypto');


var dataModels = process.cwd() + '/dataModels/';
//var User = require(dataModels + 'user').User;
//var CurLoc = require(dataModels + 'curLoc');
//var Client = require(dataModels + 'client');
//var AccessToken = require(dataModels +'accessToken');
//var RefreshToken = require(dataModels +'refreshToken');

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createCurrentLocation
], function(err) {
    console.log(arguments);
    mongoose.disconnect();
    process.exit(err ? 255 : 0);
});

var numberOfUsers = 20;

function open(callback) {
    mongoose.connection.on('open', callback);
}
function dropDatabase(callback) {
    var db = mongoose.connection.db;
    db.dropDatabase(callback);
}
function requireModels(callback) {
    require(dataModels + 'user');
    require(dataModels + 'curLoc');
    async.each(Object.keys(mongoose.models), function(modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}
function createUsers(callback) {
    var users = [];
    for (var i = 0; i<numberOfUsers; i++){
        users[i] = GenerateUser();
    }
    async.each(users, function(userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback(users));
}
function createCurrentLocation(callback) {
    var curLocs = [];
    curLocs = GenerateCurrentLocation(createUsers(function (data) {
        
    }));
    async.each(curLocs, function (userLoc, callback) {
        var curLoc = new mongoose.models.CurLoc(userLoc);
        curLoc.save(callback);
    }, callback);
}
//function crearteCurrentLocation(callback) {
//    var CurLock = [];
//    for (var i = 0; i < numberOfUsers; i++){
//        CurLock[i] = GenerateCurrentLocation(User);

//    }
//}
var GenerateUser = function () {
    var hp = CreateHashedPswd(faker.internet.password());

    return {
        "userID": faker.random.uuid(),
        "firstName": faker.name.firstName(),
        "lastName": faker.name.lastName(),
        "hashedPassword": hp.hashedPassword,
        "salt": hp.salt,
        "created": faker.date.past(),
        "photo": faker.image.avatar(),
        "rating": faker.random.number(10)
    };
};

var GenerateCurrentLocation = function (users) {
    var curLoc = [];

    for (var i in users) {
        if (users.hasOwnProperty(i)) {
            curLoc.push({
                "user": users[i].userID,
                "current_position": {
                    "x": faker.address.latitude(),
                    "y": faker.address.longitude()
                }
            })
        }
    }

    return curLoc;
};

var GenerateRequests = function (users) {
    var curReq = [];

    for (var i in users) {
        if (users.hasOwnProperty(i)) {
            var it = faker.random.number(2);
            var requestUser = {
                "userID": users[i].userID,
                "messages": []
            };
            if (faker.random.boolean() && it) {
                for (var u = 0; u < it; u++) {
                    requestUser.messages.push(
                        {
                            "requestId": faker.random.number(),
                            "position": {
                                "x": faker.address.latitude(),
                                "y": faker.address.longitude()
                            },
                            "time": faker.date.recent(),
                            "message": faker.lorem.sentence(),
                            "place": faker.address.streetName(),
                            "timeToStayAlive": faker.date.future(),
                            "answered": faker.random.boolean()
                        })
                }
                curReq.push(requestUser);
            }
        }
    }

    return curReq;
};

var GenerateDialogs = function (requests, users) {
    var dialogs = [];
    var counter = 0;

    for (var i in requests) {
        if (requests.hasOwnProperty(i)) {
            var sentTo = users[faker.random.number(users.length - 1)].user;
            var reqestSender = requests[i].user;
            var messages = {};
            var dialog = {};

            messages[reqestSender] = [];
            messages[sentTo] = [];

            for (var u = 0; u < requests[i].messages.length; u++) {
                var it = faker.random.number(5);
                if (requests[i].messages[u].answered) {
                    for (var r = 0; r < it; r++) {
                        messages[reqestSender].push(
                            {
                                "time": faker.date.recent(),
                                "message": faker.lorem.sentence(),
                                "message_id": counter++
                            });

                        messages[sentTo].push(
                            {
                                "time": faker.date.recent(),
                                "message": faker.lorem.sentence(),
                                "message_id": counter++
                            });
                    }
                }
                dialog['requestId'] = requests[i].messages[u].requestId;
                dialog['messages'] = messages;
                dialogs.push(dialog);
            }
        }
    }

    return dialogs;
};

var CreateHashedPswd = function (password) {

    this.salt = crypto.randomBytes(128).toString('hex');
    return {
        'hashedPassword': crypto.createHmac('sha1', this.salt).update(password).digest('hex'),
        'salt': this.salt,
        'plain': password
    }
};

var Encrypt = function (password, salt) {
    return crypto.createHmac('sha1', salt).update(password).digest('hex')
};


//User.remove({},function (err, result) {
//    if(err) return /*console.log(err)*/;
   // console.log(result);
//});

//for (var i = 0; i < numberOfUsers; i++){
//    var _user = new User (GenerateUser());
//    _user.save();
    //users.push(_user);
//}

//CurLoc.remove({}, function (err, result) {
//    if(err) return /*console.log(err)*/;
    //console.log(result);
//});


//var CurLocation = [];
//User.find({}, function (err, docs) {
//    if(err) return console.log(err);
//    console.log(docs);
//});
 //CurLocation =  GenerateCurrentLocation(Users);
//for (var j = 0; j < numberOfUsers; j++){
 //   var _curLoc = new CurLoc (CurLocation[j]);
  //  _curLoc.save();

//}
//var curLoc = [];
//curloc.remove({});
//for (var i = 0; i < numberofUsers; i++){
//    var _curLoc = new CurLoc (GenerateCurrentLocation(_user));
//    _curLoc.save();
//}


//var curReq = GenerateRequests(users);
//var dialogs = GenerateDialogs(curReq, users);

//db.disconnect();
console.log('finished');