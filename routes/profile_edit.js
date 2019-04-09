var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  } else {
    res.render('profile_edit', {user: currentUser});
  }
});

router.post('/', function(req, res) {
  //get inputs
  var name = req.body.name;
  var password = req.body.password;
  var address = req.body.address;

  //queries
  var currentUser = req.app.get('current user');
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