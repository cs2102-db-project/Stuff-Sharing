var express = require('express');
var router = express.Router();
// var loginScript = require('../public/javascripts/loginScript');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

// const { Pool } = require('pg')
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'stuffsharing',
//   password: 'postgres',
//   port: 5432,
// })

// pool.query('SELECT * FROM accounts WHERE accounts.username = $1::text AND accounts.password = $2::text', [loginScript.cleanSignInUsername, loginScript.cleanSignInPassword]),
//   (err, data) => {
//     if (data == null) {
//       send(alert('Username or password is invalid'));
//     }
//   };

module.exports = router;
