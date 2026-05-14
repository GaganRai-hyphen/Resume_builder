const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema({
    token: {
        type : String , 
        required : true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        expires: '7d' // Automatically remove tokens after 7 days
    }
});

const blacklistModel = mongoose.model('Blacklist', blacklistSchema);

module.exports = blacklistModel;