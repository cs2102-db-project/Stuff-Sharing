var express = require('express');
var router = express.Router();
// var loginScript = require('../public/javascripts/loginScript');

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

router.post('/', function(req, res) {
  var signUpUsername = req.body.signUpUsername;
  var signUpName = req.body.signUpName;
  var signUpPassword = req.body.signUpPassword;
  var signUpPicture = req.body.signUpPicture;
  var signUpAddress = req.body.signUpAddress;

  console.log(signUpUsername);
  console.log(signUpName);
  console.log(signUpPassword);
  console.log(signUpPicture);
  console.log(signUpAddress);

  pool.query('BEGIN', function(err, data) {
    if(err) console.log('error1');
    pool.query('INSERT INTO accounts (username, password) VALUES ($1::text, $2::text);', [signUpUsername, signUpPassword], function(err, data) {
      if(err) console.log('error2');
      if (!data) {
        console.log("already exists")
        res.send('This user already exists');
      }
      pool.query('INSERT INTO profiles (username, name, picture, address) VALUES ($1::text, $2::text, $3::text, $4::text)', [signUpUsername, signUpName, signUpPicture, signUpAddress], function(err, data) {
        if(err) console.log('error3');
        //disconnect after successful commit
        pool.query('COMMIT', function(err, data) {
          if(err) console.log('error4');
        });
        res.redirect('/login');
      });
    });
  });
  // pool.query(
  //   'BEGIN; ' +  
  //   'INSERT INTO accounts (username, password) VALUES ($1::text, $2::text); ' +
  //   'INSERT INTO profiles (username, name, picture, address) VALUES ($3::text, $4::text, $5::text, $6::text); ' +
  //   'COMMIT;', 
  //   [signUpUsername, signUpPassword, signUpUsername, signUpName, signUpPicture, signUpAddress], function (err, data) {
  //   console.log("here");
  //   if (err) {
  //     console.log('error');
  //   }
  //   if (!data) {
  //     console.log("already exists")
  //     res.send('This user already exists');
  //   } else {
  //      res.redirect('/login');
  //   }
  // });
});

module.exports = router;
