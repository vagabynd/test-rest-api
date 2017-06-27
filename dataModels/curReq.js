var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    curReq = new Schema({
        userID: {
            type: String,
            unique: true,
            required: true
        },
        requests: [{
            position: {
                fields: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
                    }
                }
            },
            requestId: {type: String},
            time: {type: Date},
            message: {type: String},
            place: {type: String},
            timeToStayAlive: {type: Date},
            answered: {type: Boolean}
        }]
    });

module.exports = mongoose.model('CurReq', curReq);
