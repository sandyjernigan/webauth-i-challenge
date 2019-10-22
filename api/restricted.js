const router = require('express').Router();

const restricted = require('./restricted-middleware.js');

router.get('/*', restricted, (req, res) => {
  res.send("<div align=\'center\'>" + 
    "<p>Hello World!</p>" + 
    "<p>Restricted Route.</p>" +
    "<p>You are now logged in.</p>" +
    "</div>");
});

module.exports = router;