const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['dog', 'cat', 'rabbit', 'bird', 'other']
    },
    age: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    emoji: {
        type: String,
        default: '🐾'
    },
    adopted: {
        type: Boolean,
        default: false
    },
    image: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Pet', petSchema);