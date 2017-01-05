var socketClient = io();
var _roomname_;
socketClient.emit('onlineusr',getnamec.innerHTML);
socketClient.on('newSocket', function (string) {
    results.innerHTML += string + '<br>';
});

socketClient.on('onlineuse', function (onlineusers) {
    online.innerHTML="";
    for(var onlineus in onlineusers){online.innerHTML += onlineusers[onlineus] +"<br>";}
});




socketClient.on('roomName', function (_roomname) {
    _roomname_ = _roomname;
});

function updateCurrentRoom(_room){
    chatroomresults.innerHTML = '';
    var str = '';
    Object.keys(_room).forEach(function(cle) {
        var username = cle.slice(0,(cle.length -14));
        str += " " + username +" : "+_room[cle]+"<br>" ;
    });
    chatroomresults.innerHTML += str;
    chatroomresults.scrollTop = chatroomresults.scrollHeight;
}

socketClient.on('updateroom', function (_room) {
    updateCurrentRoom(_room);
});

socketClient.on('careful_updateroom', function (_roomname,_room) {
    if(_roomname===_roomname_){
        updateCurrentRoom(_room);
    }
});

function deleteCurrentRoom(){
    alert("La chambre "+_roomname_+" n'est plus disponible !");
    _roomname_ = null;
    chatroomresults.innerHTML = '';
    chatroomc.value = '';
    chatroomc.disabled = true;
    envoyerchatc.disabled = true;
    currentRoom.innerHTML = 'Aucune';
}

socketClient.on('careful_room_deleted', function (_roomname) {
    if(_roomname===_roomname_){
	deleteCurrentRoom();
    }
});


socketClient.on('room_deleted', function () {
    deleteCurrentRoom();
});

socketClient.on('roomsClient', function (_rooms) {
    rooms.innerHTML = '';
    var tr;
    for (var i = 0, length = _rooms.length; i !== length; i++) {
        tr = document.createElement('tr');
        tr.innerHTML = '<td>' + _rooms[i] + '             </td><td><button class="btn btn-sm">Joindre</button></td>';
        tr.lastElementChild.lastElementChild.addEventListener('click', (function (_roomname) {
            return function () {
                setRoom(_roomname);
            };
	
        })(_rooms[i]), false);
        rooms.appendChild(tr);
    }
});

function setRoom(_roomname){
    _roomname_ = _roomname;
    chatroomc.disabled = false;
    envoyerchatc.disabled = false;
    currentRoom.innerHTML = _roomname;
    socketClient.emit('loadroom',_roomname_);
}

envoyerchatc.addEventListener('click', function (e) {
	e.preventDefault(); 
	var time = (new Date()).toISOString().slice(0, 19).replace(/[^0-9]/g, ""); 
	var username = getnamec.innerHTML;
	username += time;
        socketClient.emit('createmessage',username,_roomname_,chatroomc.value.trim());
	chatroomc.value="";
	
}, false);

logout.addEventListener('click', function () {
    socketClient.emit('outlineusr',getnamec.innerHTML);
    window.location.href = '/logout';
}, false);

