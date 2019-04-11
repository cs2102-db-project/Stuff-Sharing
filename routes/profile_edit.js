var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user == null) {
    res.redirect('/login');
  } else {
    var currentUser = req.user.rows[0];
    res.render('profile_edit', {user: currentUser});
  }
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the login page
  res.redirect('/login');
}

router.post('/', function(req, res) {
  //get inputs
  var name = req.body.name;
  var password = req.body.password;
  var address = req.body.address;

  //queries
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');
  var editAllQuery = 'UPDATE profiles SET name = $1::text, password = $2::text, address = $3::text WHERE username = $4::text';
  var editKeepPwdQuery = 'UPDATE profiles SET name = $1::text, address = $2::text WHERE username = $3::text';

  if (password.length != 0) {
    pool.query(editAllQuery, [name, password, address, currentUser.username], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        pool.query('SELECT * FROM profiles WHERE username = $1::text', [currentUser.username], (err, result) => {
            if (err) {
              return console.error('Error executing query', err.stack)
            } else {
              console.log(result.rows[0]);
              req.app.set('current user', result.rows[0]);
              res.redirect('/profile');
            }
        });
    });
  } else {
    pool.query(editKeepPwdQuery, [name, address, currentUser.username], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        pool.query('SELECT * FROM profiles WHERE username = $1::text', [currentUser.username], (err, result) => {
            if (err) {
              return console.error('Error executing query', err.stack)
            } else {
              console.log(result.rows[0]);
              req.app.set('current user', result.rows[0]);
              res.redirect('/profile');
            }
        });
    });
  }

});

module.exports = router;