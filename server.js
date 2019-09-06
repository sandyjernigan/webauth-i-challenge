const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const connectSessionKnex = require('connect-session-knex');

const UsersRouter = require('./api/usersRouter.js');
const db = require('./data/dbConfig.js');

const KnexSessionStore = connectSessionKnex(session)

const server = express();

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
server.use('/api/', UsersRouter);

server.get('/', (req, res) => {
  //req.session.name = 'Frodo';
  res.send("Hello World!");
});

module.exports = server;