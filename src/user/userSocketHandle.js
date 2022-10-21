var users;

const addUserSocket = (userId, socketId) => {
    !users.some((user) => (user.userId = userId)) && users.push({ userId, socketId });
};

const removeUserSocket = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const userSocketHandle = (io, socket, socketUsers) => {
    users = socketUsers;

    socket.on('addUserSocket', (userId) => {
        console.log('A User connected');
        addUserSocket(userId, socket.id);
        io.emit('getUsersSocket', socketUsers);
    });

    // disConnect
    socket.on('disconnect', () => {
        console.log('A User disconnected');
        removeUserSocket(socket.id);
        io.emit('getUsersSocket', socketUsers);
    });
};

module.exports = userSocketHandle;
