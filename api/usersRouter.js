const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('./usersModel.js');
const restricted = require('./restricted-middleware.js');

//#region Register

// POST 	/api/register 	
  // Creates a user using the information sent inside the body of the request. 
  // Hash the password before saving the user to the database.

router.post('/register', (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(user.password, 14);
  user.password = hash;

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

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {

        // Add Cookie that contains the user name
        req.session.user = username;
        
        res.status(200).json({ message: `Welcome ${user.username}! You are Logged in.` });
      } else {
        res.status(401).json({ message: 'You shall not pass!' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//#endregion

//#region Logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        res.send('error logging out');
      } else {
        res.send('good bye');
      }
    });
  }
});
//#endregion

//#region - Test Auth - Get all Users

// GET 	/api/users 	
  // If the user is logged in, respond with an array of all the users contained 
  // in the database. If the user is not logged in repond with the correct status 
  // code and the message: 'You shall not pass!'.

router.get('/users', restricted, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

//#endregion

module.exports = router;