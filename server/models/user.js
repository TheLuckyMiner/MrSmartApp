const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    testComplete: {
        type: Number,
        default: 0
    },
    lessonComplete: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        default: 'User'
    }
});

module.exports = mongoose.model('User', UserSchema);
