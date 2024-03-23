const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const TheorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Theory', TheorySchema);
