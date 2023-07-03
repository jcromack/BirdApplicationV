// user.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the user schema
var UserSchema = new Schema({
    username: {
        type: String,
        required: true
    }
});

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
