const fs = require('fs');

function saveStorage(storage) {
    fs.writeFileSync('server/storage.json', JSON.stringify(storage), (err) => {
        if (err) throw err;
    });
}

function saveUsers(users) {
    let storage = getStorage();
    storage.users = users;
    saveStorage(storage);
}


function saveRooms(rooms) {
    let storage = getStorage();
    storage.rooms = rooms;
    saveStorage(storage);
}

function getStorage() {
    let storage = JSON.parse(fs.readFileSync('server/storage.json', 'utf8'));
    return storage;
}

function getUsers() {
    return getStorage().users;
}

function getRooms() {
    return getStorage().rooms;
}


function addRoom(newRoom){
    let updatedRooms = [...getRooms(), newRoom];
    saveRooms(updatedRooms);
    return updatedRooms;
}

function addUser(user){
    console.log("add user");
    if(!userExist(user)){
    let updatedUsers = [...getUsers(), user];
    saveUsers(updatedUsers);
    return updatedUsers;
    }
    else{
        let updatedUsers = getUsers().map(_user => {
            if(_user.id === user.id){
                return user;
            }
            return _user;
        });
        saveUsers(updatedUsers);
        return updatedUsers;
    }

}


function userExist(user) {
    let findedUser = getUsers().find((_user) => {
        return user.id === _user.id;
    });
    return findedUser !== undefined;
}

function userInRoom(user, roomId) {
    let findedUser;
    getRooms().forEach((room) => {
        if(room.id === roomId){
            findedUser = room.usersOnline.find( _user =>{
                return user.id === _user.id;
            });
        }
    })
    return findedUser !== undefined;

}

function isRoomExist(roomId){
    return getRooms().some((room) => {
        return room.id === roomId;
    })
}

function getRoomById(roomId) {
    return getRooms().find((room) => {
        return room.id === roomId;
    })
}

function getUserById(userId) {
    return getUsers().find((user) => {
        return user.id === userId;
    })
}

function getUserBySocketId(socketId) {
    return getUsers().find((user) => {
        return user.socketId === socketId;
    })
}

function addUserToRoom(user, roomId){
    let updatedRooms = getRooms().map((room) => {
        if(room.id === roomId){
            return {id: roomId, usersOnline: [...room.usersOnline, user]};
        }
        return room;
    });
    saveRooms(updatedRooms);    
    return updatedRooms;
}

function leaveRoom(disconnectedUser){
    let updatedRooms = getRooms().map((room) => { //Удаляем позьзователя из списка пользователей онлайн
        if(room.id === disconnectedUser.roomId){
            let updatedUsersOnline = room.usersOnline.filter((user) => {
                return user.id !== disconnectedUser.id
            });

            return {id: room.id, usersOnline: updatedUsersOnline};
        }
        return room;
    });
    saveRooms(updatedRooms);

    let updatedUsers = getUsers().filter((user) => { //Удаляем пользователя из списка пользователей
        return user.id !== disconnectedUser.id;
    });
    saveUsers(updatedUsers);
}

function bindUserWithNewSocket(user, socketId){
    console.log(user);
    let {id, name, roomId} = user;
    return {id: id, name: name, roomId: roomId, socketId: socketId}
}

module.exports = {
    addRoom: addRoom,
    isRoomExist: isRoomExist,
    addUserToRoom: addUserToRoom,
    getRoomById: getRoomById,
    addUser: addUser,
    getUserById: getUserById,
    leaveRoom: leaveRoom,
    userExist: userExist,
    userInRoom: userInRoom,
    getUserBySocketId: getUserBySocketId,
    bindUserWithNewSocket: bindUserWithNewSocket
};