const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let ChatSchema = new Schema(
    {
        postId: {type: String, required: true},
        username: {type: String, required: true, max: 100},
        message: {type: String, required: true},
        created_at: {type: Date, required: true},
    }
);

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
