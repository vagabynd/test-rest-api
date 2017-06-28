var mongoose = require('../libs/db/mongoose'),
    Schema = mongoose.Schema,

    CurReq = new Schema({
        userID: {
            type: String,
            unique: true,
            required: true
        },
        messages: [{
            position: {
                    x: {
                        type: String
                    },
                    y: {
                        type: String
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
exports.CurReq = mongoose.model('CurReq', CurReq);
