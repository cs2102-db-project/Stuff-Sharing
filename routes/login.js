var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function(req, res) {
  // render the page and pass in any flash data if it exists
  res.render('login', { title: 'Login', message: req.flash('signupMessage') });
});

router.post('/', function(req, res) {
  var signInUsername = req.body.signInUsername;
  var signInPassword = req.body.signInPassword;
  console.log(signInUsername);
  console.log(signInPassword);

  var pool = req.app.get('pool');
  pool.query('SELECT * FROM accounts WHERE accounts.username = $1 AND accounts.password = $2', [signInUsername, signInPassword],
    function (err, data) {
      if (err) {
        res.send(err);
      }
      if (data.rows.length == 0) {
        res.send("Username or password is invalid");
      } else {
        pool.query('SELECT * FROM profiles WHERE profiles.username = $1', [signInUsername],
          function (err, data2) {
            req.app.set('current user', data2.rows[0]);
            res.redirect('/profile');
          }
        );
      }
  });
});

module.exports = router;
