var mongoose = require('../libs/db/mongoose'),
    Schema = mongoose.Schema,

    CurLoc = new Schema({
        userID: {
            type: String,
            unique: true,
            required: true
        },
        current_position:{

                x:{
                    type: String
                },
                y:{
                    type: String
                }
        }
    });

exports.CurLoc = mongoose.model('CurLoc', CurLoc);
