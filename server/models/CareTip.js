const mongoose = require('mongoose');

const careTipSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['health', 'nutrition', 'training', 'grooming', 'general']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CareTip', careTipSchema);