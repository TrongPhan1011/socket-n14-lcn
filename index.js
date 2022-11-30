const { addUserSocket, removeUserSocket, getUserSocket } = require('./src/controller/userController');

const PORT = process.env.PORT || 8900;
const io = require('socket.io')(PORT, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

var socketUsers = [];
var listCall = [];

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
    socket.on('removeMess', ({ receiverId, idMess }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            socket.join(user.userId);
            io.to(user.userId).emit('getMessRemoved', idMess);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getMessRemoved', idMess);
        }
    });
    socket.on('removeAllChat', ({ receiverId, idChat }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            socket.join(user.userId);
            io.to(user.userId).emit('getChatRemoved', idChat);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getChatRemoved', idChat);
        }
    });
    socket.on('sendReactMess', ({ receiverId, contentMessage }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            socket.join(user.userId);
            io.to(user.userId).emit('getReactMess', contentMessage);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getReactMess', contentMessage);
        }
    });

    // state chat
    socket.on('createChat', (idChat) => {
        socket.join(idChat);
        io.to(idChat).emit('createChat', true);
    });

    // call
    socket.on('sendSignalCall', ({ receiverId, data }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            io.to(user.userId).emit('getCallSignal', data);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);

            io.to(newUser.userId).emit('getCallSignal', data);
        }
    });
    socket.on('sendIdCall', ({ receiverId, peerId }) => {
        const user = getUserSocket(socketUsers, receiverId);

        if (!!user) {
            io.to(user.userId).emit('getPeerId', peerId);
        } else {
            addUserSocket(socketUsers, receiverId, socket.id);
            const newUser = getUserSocket(socketUsers, receiverId);
            socket.join(newUser.userId);
            io.to(newUser.userId).emit('getPeerId', peerId);
        }
    });
});
