const express = require('express');

const UsersRouter = require('./api/usersRouter.js');

const server = express();

server.use(express.json());
server.use('/api/', UsersRouter);

module.exports = server;