var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profileController');

/* GET home page. */
router.get('/', isLoggedIn, function(req, res) {
  profileController.displayProfile(req, res);
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the login page
  res.redirect('/login');
}

module.exports = router;
