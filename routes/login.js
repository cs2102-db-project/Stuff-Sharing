var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stuffsharing',
  password: 'postgres',
  port: 5432,
})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });

});

router.post('/', function(req, res) {
  var signInUsername = req.body.signInUsername;
  var signInPassword = req.body.signInPassword;
  console.log(signInUsername);
  console.log(signInPassword);
  pool.query('SELECT * FROM accounts WHERE accounts.username = $1::text AND accounts.password = $2::text', [signInUsername, signInPassword],
    function (err, data) {
      if (err) {
        res.send(err);
      }
      if (data.rows.length == 0) {
        res.send("Username or password is invalid");
      } else {
        pool.query('SELECT * FROM profiles WHERE profiles.username = $1::text', [signInUsername],
          function (err, data2) {
            req.app.set('current user', data2.rows[0]);
            res.redirect('/profile');
          }
        );
      }
  });
});

module.exports = router;
