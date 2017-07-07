var mongoose = require('../libs/db/mongoose'),
    crypto = require('crypto'),


    Schema = mongoose.Schema,

    User = new Schema({
        userID: {
            type: String,
            unique: true,
            required:  true
        },
        firstName: {
            type: String,
            unique: false,
            required: false
        },
        lastName: {
            type: String,
            unique: false,
            required: false
        },
        photo: {
          type: String,
          required: false
        },
        rating: {
          type: Number,
          required: false
        },
        created: {
            type: Date,
            default: Date.now
        },
        hashedPassword: {
            type: String,
            required: false
        },
        salt: {
            type: String,
            required: false
        }
    });

User.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512).toString('hex');
};

User.virtual('userId')
    .get(function () {
        return this.id;
    });
User.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('hex');
        //more secure - this.salt = crypto.randomBytes(128).toString('hex');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


User.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

exports.User = mongoose.model('User', User);
