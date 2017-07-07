var mongoose = require('../libs/db/mongoose'),
    Schema = mongoose.Schema,

    CurDlg = new Schema({
        requestId: {
            type: String,
            unique: true,
            required: true
        },
        messages: Schema.Types.Mixed,
        sentTo: Schema.Types.Mixed
    });
exports.CurDlg = mongoose.model('CurDlg', CurDlg);