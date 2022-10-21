const userSocketHandle = require('./src/user/userSocketHandle');

const io = require('socket.io')(8900, {
    cors: {
        origin: 'http://localhost:3000',
    },
});

var socketUsers = [];

io.on('connection', (socket) => {
    console.log('connected');
    /**
     * Nhận lại user id và lưu thông tin user id và id soket lại
     * Thêm thành công thì gửi đi "getUsersSocket" với thông tin là list socketUser
     */

    userSocketHandle(io, socket, socketUsers);
});
