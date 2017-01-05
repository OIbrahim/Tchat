var socketAdmin = io('/admins');
socketAdmin.on('newSocketAdmin', function (string) {
    results.innerHTML += string + '<br>';
});
socketAdmin.on('usersAdmin', function (_users) {
    users.innerHTML = '';
    var tr;
    for (var i = 0, length = _users.length; i !== length; i++) {
        tr = document.createElement('tr');
        if (_users[i] === 'Admin')
            tr.innerHTML = '<td>' + _users[i] + '</td><td><button class="btn btn-sm">Editer</button></td>';
        else {
            tr.innerHTML = '<td>' + _users[i] + '</td><td><button class="btn btn-sm">Editer</button><button class="btn btn-default btn-sm">Supprimer</button></td>';
            tr.lastElementChild.lastElementChild.addEventListener('click', (function (_username) {
                return function () {
                    if (confirm('Supprimer l\'utilisateur "' + _username + '" ?'))
                        socketAdmin.emit('deleteUserAdmin', _username);
                };
            })(_users[i]), false);
        }
        tr.lastElementChild.firstElementChild.addEventListener('click', (function (_username) {
            return function () {
                username.value = _username;
            };
        })(_users[i]), false);
        users.appendChild(tr);
    }
    username.click();
    password.click();
});

socketAdmin.on('roomsAdmin', function (_rooms) {
    rooms_admin.innerHTML = '';
    var tr;
    for (var i = 0, length = _rooms.length; i !== length; i++) {
        tr = document.createElement('tr');
        tr.innerHTML = '<td>' + _rooms[i] + '</td><td><button class="btn btn-default btn-sm">Supprimer</button></td>';
        tr.lastElementChild.firstElementChild.addEventListener('click', (function (_roomname) {
	    return function () {
	        if (confirm('Supprimer la chambre "' + _roomname + '" ?'))
	            socketAdmin.emit('deleteRoomAdmin', _roomname);
	    };
        })(_rooms[i]), false);
        rooms_admin.appendChild(tr);
    }
    roomname.click();
});

createuser.addEventListener('click', function (e) {
    if (username.checkValidity() && password.checkValidity()) {
        e.preventDefault();
        socketAdmin.emit('createUserAdmin', username.value.trim(), password.value);
        username.value = '';
        password.value = '';
    }
}, false);

createroom.addEventListener('click', function (e) {
    if (roomname.checkValidity()) {
        e.preventDefault();
        socketAdmin.emit('createRoomAdmin', roomname.value.trim());
        roomname.value = '';
    }
}, false);

logout.addEventListener('click', function () {
    window.location.href = '/logout';
}, false);
