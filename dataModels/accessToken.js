var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// AccessToken
var AccessToken = new Schema({
    userId: {
        type: String,
        required: true
    },

    clientId: {
        type: String,
        required: true
    },

    token: {
        type: String,
        unique: true
    },
    vk_token: {
        type: String
    },

    created: {
        type: Date,
        default: Date.now
    }
});

module.exports  = mongoose.model('AccessToken', AccessToken);