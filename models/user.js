const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    phone: {
        type: String,
        required: true,
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    password: {
        type: String,
        required: true,
    },
    googleId: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
