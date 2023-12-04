const socketIo = require('socket.io');

const initIo = (httpServer, httpsServer) => {
    const io = new socketIo.Server({
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

module.exports = initIo;
