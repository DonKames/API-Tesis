const socketIo = require('socket.io');

let io = null;
const initIo = (httpServer, httpsServer) => {
    io = new socketIo.Server({
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    io.attach(httpServer);
    io.attach(httpsServer);

    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');

        socket.on('disconnect', () => {
            console.log('Cliente desconectado');
        });

        // Aquí puedes agregar más manejadores de eventos según sea necesario
    });

    return io;
};

const getIo = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

module.exports = { initIo, getIo };
