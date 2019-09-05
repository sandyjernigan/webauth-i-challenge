const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');

const UsersRouter = require('./api/usersRouter.js');

const server = express();

// configure express-session middleware
const sessionConfig = {
  name: "hellothere",
  secret: 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    secure: false, // true, (in production set to true) // only set cookies over https. Server will not send back a cookie over http.
    httpOnly: true,
  }, // 1 day in milliseconds // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: false, // GDPR laws against setting cookies automatically
}

server.use(helmet());
server.use(express.json());
server.use('/api/', UsersRouter);
server.use(cors());
server.use(session(sessionConfig));

// server.use(
//   session({
//     name: 'notsession', // default is connect.sid
//     secret: 'nobody tosses a dwarf!',
//     cookie: {
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       secure: true, // only set cookies over https. Server will not send back a cookie over http.
//     }, // 1 day in milliseconds
//     httpOnly: true, // don't let JS code access cookies. Browser extensions run JS code on your browser!
//     resave: false,
//     saveUninitialized: false,
//   })
// );

server.get('/', (req, res) => {
  res.send("Hello World!");
});

module.exports = server;