var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res) {
  var pool = req.app.get('pool');
  var currentUser = req.user.rows[0];
  // console.log("currentUser = " + JSON.stringify(currentUser));
  pool.query("SELECT * FROM stuff WHERE stuff.owner = $1::text", [currentUser.username], function(err, data) {
    var items = data.rows;
    // console.log("data.rows = " + JSON.stringify(data.rows));
    res.render('profile', { 
      user : currentUser, // get the user out of session and pass to template
      myItems: items 
    });
  });
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
