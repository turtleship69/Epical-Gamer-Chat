var socket;
var usernameInput
var chatIDInput;
var messageInput;
var chatRoom;
var dingSound;
var messages = [];
var delay = true;

function onload() {
    socket = io();
    usernameInput = document.getElementById("NameInput");
    chatIDInput = document.getElementById("IDInput");
    messageInput = document.getElementById("ComposedMessage");
    chatRoom = document.getElementById("RoomID");
    dingSound = document.getElementById("Ding");
    linka = document.getElementById("linka");
    linkp = document.getElementById("linkp");

    //get last username
    if (localStorage.getItem("name")) {
        usernameInput.value = localStorage.getItem("name")
    }


    //get chatroom from url
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const room = urlParams.get('room');
    if (room) {
        chatIDInput.value = room;
    }


    //hide link
    linkp.style.visibility = "hidden"

    socket.on("join", function(room) {
        chatRoom.innerHTML = "Chatroom: " + room;
    })

    socket.on("recieve", function(message) {
        console.log(message);
        if (messages.length < 10) {
            messages.push(message);
            dingSound.currentTime = 0;
            dingSound.play();
        }
        else {
            messages.shift();
            messages.push(message);
        }
        for (i = 0; i < messages.length; i++) {
            document.getElementById("Message" + i).innerHTML = messages[i];
            document.getElementById("Message" + i).style.color = "#303030";
        }
    })
}

function Connect() {
    socket.emit("join", chatIDInput.value, usernameInput.value);
    //save username to localstorage to autoload nextime
    localStorage.setItem("name", usernameInput.value);
    linka.href = `/?room=${chatIDInput.value}`;
    linkp.style.visibility = "visible";
    return false;
}

function Send() {
    if (delay && messageInput.value.replace(/\s/g, "") != "") {
        delay = false;
        setTimeout(delayReset, 1000);
        socket.emit("send", messageInput.value);
        messageInput.value = "";
    }
    return false;
}

function delayReset() {
    delay = true;
}