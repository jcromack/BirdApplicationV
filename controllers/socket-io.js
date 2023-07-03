let bodyParser = require("body-parser");
let Chat = require('../models/chatModel');

exports.init = function (io) {
    io.sockets.on('connection', function (socket) {
        try {
            /**
             * create or join a room
             */

            socket.on('create or join', function (room, userId) {
                socket.join(room);
                socket.to(room).emit('joined', room, userId);
            });

            /**
             * send chat messages
             */
            socket.on('chat', function (roomNo, userId, chatText) {
                socket.to(roomNo).emit('chat', userId, roomNo, chatText);

                console.log('Is chat being created?');
                console.log('UserID:' + userId);
                // create chat object
                let today = new Date();
                let chatData = {
                    "postId": roomNo,
                    "username": userId,
                    "message": chatText,
                    "created_at": today.toString()
                }
                console.log(chatData.username)
                createChat(chatData);
            });

            /**
             * disconnect
             */
            socket.on('disconnect', function (reason) {
                console.log('User has disconnected')
            });
        } catch (e) {}
    });
}


// creates the chat for a post
function createChat(chatData) {
    let chat = new Chat({
        postId: chatData.postId,
        username: chatData.username,
        message: chatData.message,
        created_at: chatData.created_at
    });

    chat.save(function (err, results) {
        if (err)
            console.log(err);
    });
}