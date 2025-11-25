const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    story: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        default: '🐾'
    },
    image: String
}, {
    timestamps: true
});

module.exports = mongoose.model('SuccessStory', successStorySchema);