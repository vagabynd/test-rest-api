var faker = require('faker/locale/ru');
var crypto = require('crypto');

var GenerateUser = function () {
    var hp = CreateHashedPswd(faker.internet.password());

    return {
        "user": faker.random.uuid(),
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
                "user": users[i].user,
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
                "user": users[i].user,
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
                                "message": faker.lorem.sentence()
                            });

                        messages[sentTo].push(
                            {
                                "time": faker.date.recent(),
                                "message": faker.lorem.sentence()
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


var users = [];
var numberOfUsers = 100;

for (var i = 0; i < numberOfUsers; i++){
    var _user = GenerateUser();
    users.push(_user);
}

var curLoc = GenerateCurrentLocation(users);
var curReq = GenerateRequests(users);
var dialogs = GenerateDialogs(curReq, users);


console.log('finished');