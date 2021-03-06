var mongoose = require('./libs/db/mongoose');
var async = require('async');
var faker = require('faker/locale/ru');
var crypto = require('crypto');

var libs = process.cwd() + '/libs/';
var config = require(libs + 'config');

var log = require(libs + 'log/log')(module);

var dataModels = process.cwd() + '/dataModels/';

mongoose.Promise = global.Promise;

var users = [];
var requests = [];

async.series([
    open,
    dropDatabase,
    requireModels,
    createUsers,
    createClients,
    createCurrentLocation,
    createRequests,
    createDialogs
], function (arg) {
    log.info('DB recreated successfully!');
    //mongoose.disconnect();
});

var numberOfUsers = 7;

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
    require(dataModels + 'curReq');
    require(dataModels + 'curDlg');
    require(dataModels + 'client');
    async.each(Object.keys(mongoose.models), function (modelName, callback) {
        mongoose.models[modelName].ensureIndexes(callback);
    }, callback);
}

function createUsers(callback) {
    for (var i = 0; i < numberOfUsers; i++) {
        users[i] = GenerateUser();
    }

    users.push({
        userID: config.get("default:user:username"),
        password: config.get("default:user:password")
    });

    async.each(users, function (userData, callback) {
        var user = new mongoose.models.User(userData);
        user.save(callback);
    }, callback);
}

function createClients(callback) {
    var clients = [];

    clients.push({
        name: config.get("default:client:name"),
        clientId: config.get("default:client:clientId"),
        clientSecret: config.get("default:client:clientSecret")
    });

    clients.push({
        name: 'VK API',
        clientId: 6084066,
        clientSecret: "secret_vk"
    });

    async.each(clients, function (clientData, callback) {
        var client = new mongoose.models.Client(clientData);
        client.save(callback);
    }, callback);
}


function createCurrentLocation(callback) {
    var curLocs = GenerateCurrentLocation(users);
    async.each(curLocs, function (curLocData, callback) {
        var curLoc = new mongoose.models.CurLoc(curLocData);
        curLoc.save(callback);
    }, callback);
}

function createRequests(callback) {
    requests = GenerateRequests(users);
    async.each(requests, function (requestData, callback) {
        var request = new mongoose.models.CurReq(requestData);
        request.save(callback);
    }, callback);
}

function createDialogs(callback) {
    var dialogs = GenerateDialogs(requests, users);
    async.each(dialogs, function (dialogData, callback) {
        var dialog = new mongoose.models.CurDlg(dialogData);
        dialog.save(callback);
    }, callback);
}




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
                "userID": users[i].userID,
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
                            "position": {
                                "x": faker.address.latitude(),
                                "y": faker.address.longitude()
                            },
                            "requestId": faker.random.number(),
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
            var sentTo = users[faker.random.number(users.length - 1)].userID;
            var reqestSender = requests[i].userID;
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
