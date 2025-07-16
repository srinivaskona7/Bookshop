const mongoose = require('mongoose');
// This schema should be identical to the one in auth-service
// to ensure data consistency.
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passwordHint: { type: String },
    profilePicture: { type: String },
    role: {
        type: String,
        enum: ['Admin', 'Manager', 'Customer'],
        default: 'Customer'
    }
});

module.exports = mongoose.model('User', UserSchema);