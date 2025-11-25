const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    interest: {
        type: String,
        required: true,
        enum: ['volunteer', 'donate', 'adopt', 'foster', 'other']
    },
    message: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);