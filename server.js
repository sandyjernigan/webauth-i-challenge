const express = require('express');

const UsersRouter = require('./api/usersRouter.js');

const server = express();

server.use(helmet());
server.use(express.json());
server.use('/api/', UsersRouter);
server.use(cors());

server.get('/', (req, res) => {
  res.send("Hello World!");
});

module.exports = server;