var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    CurLoc = new Schema({
        userID: {
            type: String,
            unique: true,
            required: true
        },
        curPos:{
            fields:{
                x:{
                    type: String
                },
                y:{
                    type: String
                }
            }
        }
    });

exports.CurLoc = mongoose.model('CurLoc', CurLoc);
