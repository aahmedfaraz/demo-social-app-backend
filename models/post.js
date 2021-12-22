const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    },
    message : {
        type : String,
        required : true,
    },
    date : {
        type : Date,
        default : Date.now
    },
});

module.exports = mongoose.model('post', PostSchema);