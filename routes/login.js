var express = require('express');
var router = express.Router();

var sanitise = require('express-validator/check');

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

  if (signInUsername.length == 0 || signInPassword.length == 0) {
    return res.status(400).send("Username or Password is missing");
  }
  pool.query('SELECT 1 FROM accounts WHERE accounts.username = $1::text AND accounts.password = $2::text', [signInUsername, signInPassword], function (err, data) {
    if (err) {
      console.log('error');
    }
    if (data.rows.length == 0) {
      console.log('hello');
      res.status(400).send("Username or password is invalid");
    } else {
       res.redirect('/profile');
    }
  });
});

module.exports = router;
