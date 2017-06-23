var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    curLoc = new Schema({
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

module.exports = mongoose.model('CurLoc', curLoc);
