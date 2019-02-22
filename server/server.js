const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const io = require('socket.io')();
const storage = require("./storage");
const uuidv4 = require('uuid/v4'); // Генератор ID
const SOCKET_PORT = 4300;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

io.on('connection', function(socket)
{
    console.log('a user connected ' + socket.id);


    socket.on('message', function(userMessage)
    {
        let user = storage.getUserBySocketId(socket.id);
        io.to(user.roomId).emit('message', {...userMessage, type: 'message', user: user});
    });

    socket.on('join', function ({roomId, user: joinedUser}, callback)
    {
        let newUserId = uuidv4();

        console.log("USERR" + typeof joinedUser);
        let user = {id: joinedUser.id || newUserId, name: joinedUser.name, roomId: roomId, socketId: socket.id};
        console.log(user);

        if (storage.isRoomExist(roomId)) {
            console.log('join');
            storage.addUser(user);
            // сокет и пользователь в хранилище
            if(!storage.userInRoom(user, roomId)){
                storage.addUserToRoom(user, roomId);
                io.to(roomId).emit('message', {
                    msg: 'присоиденился к чату',
                    time: Date.now(),
                    type: 'notice',
                    user: user,
                });
            }

            socket.join(roomId);
            let room = storage.getRoomById(roomId);
            callback(true);
            socket.emit('join', {room: room, user: user});
            io.to(roomId).emit('update users online list', {usersOnline: room.usersOnline});

        } else callback(false);
    });

    socket.on('leave', () =>
    {
        let disconnectedUser = storage.getUserBySocketId(socket.id);
        if(disconnectedUser) {
            storage.leaveRoom(disconnectedUser);

            io.to(disconnectedUser.roomId).emit('update users online list', {usersOnline: storage.getRoomById(disconnectedUser.roomId).usersOnline});
            io.to(disconnectedUser.roomId).emit('message', {
                msg: 'покинул чат',
                time: Date.now(),
                type: 'notice',
                user: disconnectedUser
            });
        }else console.log('');
    });

    socket.on('create room', function ({name, id})
    {
        console.log("fsdfsfs");
        console.log(name + "   " +  id);
        let newUserId = uuidv4();
        let roomId = uuidv4();
        let user = {id: id || newUserId, name: name, roomId: roomId, socketId: socket.id};
        console.log(user);

        if(!storage.userExist(user)) {
            storage.addUser(user);
        }

        let newRoom = {id: roomId, usersOnline: [{name: user.name, id: user.id}]};
        storage.addRoom(newRoom);

        socket.join(roomId);
        socket.emit('join', {room: storage.getRoomById(roomId), user: user})
    });

    socket.on('disconnect', function()
    {
        console.log('user disconnected ' + socket.id);
        let disconnectedUser = storage.getUserBySocketId(socket.id);
        if(disconnectedUser){
            storage.leaveRoom(disconnectedUser);

            io.to(disconnectedUser.roomId)
              .emit('update users online list', {usersOnline: storage.getRoomById(disconnectedUser.roomId).usersOnline});
            io.to(disconnectedUser.roomId).emit('message', {
                msg: 'покинул чат',
                time: Date.now(),
                type: 'notice',
                user: disconnectedUser
            });
        }
    });
});

io.listen(SOCKET_PORT);