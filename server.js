const express = require('express');

const Router = require('./api/router.js');

const server = express();

server.use(express.json());
server.use('/api/', Router);

module.exports = server;