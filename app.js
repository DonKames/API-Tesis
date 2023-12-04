const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const https = require('https');
const http = require('http');
const fs = require('fs');
const initIo = require('./config/socket');

const app = express();

const options = {
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem'),
};

// Configurar CORS
const corsOptions = {
    origin: 'http://localhost:5173', // URL de tu cliente React
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Depurar (colocado antes de las rutas)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} a ${req.url}`);
    console.log(`Ruta: ${req.path}`);
    console.log('req.body', req.body);
    console.log('req.params', req.params);
    next();
});

app.use('/api', routes); // Ahora colocado después del middleware de depuración

// app.use(express.json());

// Create an HTTP service.
const httpServer = http.createServer(app);
httpServer.listen(3000, () => {
    console.log('HTTP Server is running on port 3000');
});

// Create an HTTPS service identical to the HTTP service.
const httpsServer = https.createServer(options, app);
httpsServer.listen(3001, () => {
    console.log('HTTPS Server is running on port 3001');
});

// Configurar socket.io para ambos servidores
const io = initIo(httpServer, httpsServer);
// io.attach(httpServer);
// io.attach(httpsServer);

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    // Aquí puedes agregar más manejadores de eventos según sea necesario
});

module.exports = { app };
