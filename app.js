const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const options = {
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem'),
};

app.use(cors());
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
http.createServer(app).listen(3000);
console.log('HTTP Server is running on port 3000');

// Create an HTTPS service identical to the HTTP service.
https.createServer(options, app).listen(3001);
console.log('HTTPS Server is running on port 3001');
