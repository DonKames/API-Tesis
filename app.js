const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/routes');
const https = require('https');
const fs = require('fs');

const app = express();

const options = {
    key: fs.readFileSync('./certs/localhost-key.pem'),
    cert: fs.readFileSync('./certs/localhost.pem'),
};

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', routes);

// Depurar
app.use((req, res, next) => {
    console.log('req.body', req.body);
    next();
});

app.use(express.json());

https.createServer(options, app).listen(3000, () => {
    console.log('Server is running on port 3000');
});
