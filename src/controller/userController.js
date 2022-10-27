const addUserSocket = (users, userId, socketId) => {
    !users.some((user) => (user.userId = userId)) && users.push({ userId, socketId });
    return users;
};

const removeUserSocket = (users, socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
    return users;
};

const getUserSocket = (users, senderId) => {
    return users.find((user) => user.userId === senderId);
};

module.exports = { addUserSocket, removeUserSocket, getUserSocket };
