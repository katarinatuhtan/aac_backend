const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['u_obradi', 'odobren', 'odbijen'],
        default: 'u_obradi'
    },
    author: {
        type: String,
        required: true,
    },
    request_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true,
    },
    url: {
        type: String,
    },
}, {
    timestamps: true
});

const Content = mongoose.model('Content', contentSchema);

module.exports = Content;