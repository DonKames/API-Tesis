const socketIo = require('socket.io');

const io = new socketIo.Server({
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

module.exports = io;
