const { addUserSocket, removeUserSocket, getUserSocket } = require('./src/controller/userController');

const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

var socketUsers = [];

io.on('connection', (socket) => {
    // reconnect
    socket.on('error', function () {});
    console.log('connected');
    /**
     * Nhận lại user id và lưu thông tin user id và id soket lại
     * Thêm thành công thì gửi đi "getUsersSocket" với thông tin là list socketUser
     */
    socket.on('addUserSocket', (userId) => {
        console.log('A User connected');
        socketUsers = addUserSocket(socketUsers, userId, socket.id);
        io.emit('getUsersSocket', socketUsers);
    });

    // disconnect
    socket.on('disconnect', () => {
        console.log('A User disconnected');
        socketUsers = removeUserSocket(socketUsers, socket.id);
        io.emit('getUsersSocket', socketUsers);
    });

    socket.on('sendMessage', ({ receiverId, contentMessage }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            socket.join(user.userId);
            io.to(user.userId).emit('getMessage', contentMessage);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getMessage', contentMessage);
        }
    });
    socket.on('sendMessChange', ({ receiverId, contentMessage }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            socket.join(user.userId);
            io.to(user.userId).emit('getMessChange', contentMessage);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getMessChange', contentMessage);
        }
    });
});
