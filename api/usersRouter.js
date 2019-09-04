const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bcrypt = require('bcryptjs')

const usersModel = require('./usersModel.js');

const router = express.Router();

//#region Register

// POST 	/api/register 	
  // Creates a user using the information sent inside the body of the request. 
  // Hash the password before saving the user to the database.

server.post('/api/register', (req, res) => {
  let user = req.body;

  bcrypt.hashSync(user.password, 12);

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//#endregion

//#region Login

// POST 	/api/login 	
  // Use the credentials sent inside the body to authenticate the user. 
  // On successful login, create a new session for the user and send back a 
  // 'Logged in' message and a cookie that contains the user id. If login fails, 
  // respond with the correct status code and the message: 'You shall not pass!'

server.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}! You are Logged in.` });
        // TODO: Add Cookie that contains the user id

      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//#endregion

//#region - Custom

// GET 	/api/users 	
  // If the user is logged in, respond with an array of all the users contained 
  // in the database. If the user is not logged in repond with the correct status 
  // code and the message: 'You shall not pass!'.

server.get('/api/users', isLoggedIn, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//#endregion

//#region - Custom Middleware
function isLoggedIn(req, res, next) {
  // TODO: Check for cookie with login data, if exists go to next()
  next();
}
//#endregion

module.exports = router;