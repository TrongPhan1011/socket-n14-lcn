const { addUserSocket, removeUserSocket, getUserSocket } = require('./src/controller/userController');

const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
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
        console.log(contentMessage);
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
    // state chat
    socket.on('createChat', (idChat) => {
        socket.join(idChat);
        io.to(idChat).emit('createChat', true);
    });

    // call
    socket.emit('me', socket.id);
    socket.on('userConnect', (data) => {
        socket.join(data.idJoin);
    });

    socket.on('callUser', (data) => {
        // userToCall: id of Friend

        socket.join(data.userToCall);

        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from,
            to: data.userToCall,
            name: data.name,
        });
    });

    socket.on('answerCall', (data) => {
        console.log(data.signal);
        socket.join(data.to);
        io.to(data.to).emit('callAccepted', data.signal);
    });
});
