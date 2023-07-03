let name = null;
let roomNo = null;
let socket = io();

/**
 * called by <body onload>
 * it initialises the interface and the expected socket messages
 * plus the associated actions
 */
function init() {
    name = sessionStorage.getItem("username")

    var postElement = document.getElementById('post_id');
    roomNo = postElement.textContent;
    connectToRoom(name, roomNo);

    console.log(name)
    console.log(roomNo)
    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
        } else {
            // notifies that someone has joined the room
            writeOnHistory(userId,' has joined the room ', true);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory(who, chatText,false);
    });
    /// Called when someone leaves the room
    socket.on('left', function (room, userId) {
        writeOnHistory(userId,'has left the room',true);
    });
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom(username, roomID) {
    console.log('Is connection working?')
    socket.emit('create or join', roomID, username);
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendComment() {
    console.log('Is send comment working?')
    let posterText = name + ': ';
    let chatText = posterText + document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
    $("#comment-section").load(" #comment-section > *");
    let getValue= document.getElementById("chat_input");
    getValue.value = "";

}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}