const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');
const server = express();

// Router requires
const UsersRouter = require('./api/usersRouter.js');
const RestrictedRouter = require('./api/restricted.js');

// Database
const db = require('./data/dbConfig.js');
const KnexSessionStore = connectSessionKnex(session)

// configure express-session middleware
const sessionConfig = {
  name: "cookiemonster",
  secret: 'keep it secret, keep it safe',
  cookie: {
    maxAge: 1 * 24 * 60 * 60 * 1000, // days * hours * minutes * seconds * milliseconds
    secure: false, // true, (in production set to true) // only set cookies over https. Server will not send back a cookie over http.
    httpOnly: true, // browser can't access via js
  }, // 1 day in milliseconds // don't let JS code access cookies. Browser extensions run JS code on your browser!
  resave: false,
  saveUninitialized: true, // GDPR laws against setting cookies automatically
  // store the session
  store: new KnexSessionStore({
    knex: db,
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 60 * 60000
  })
}

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));

// Routers
server.use('/api/', UsersRouter);
server.use('/api/restricted/', RestrictedRouter);

// Base Route
server.get('/', (req, res) => {
  res.send("<div align=\'center\'>" + 
    "<p>Hello World!</p>" + 
    "<p>React App should have a login app.</p>" +
    "<p>If redirected to this page, cookie is not set and user needs to login.</p>" +
    "</div>");
});

const sendUserError = (msg, res) => {
  res.status(422);
  res.json({ Error: msg });
  return;
};

module.exports = server;