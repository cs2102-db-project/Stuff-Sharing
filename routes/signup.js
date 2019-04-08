var express = require('express');
var router = express.Router();
// var loginScript = require('../public/javascripts/loginScript');

var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

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

  var pool = req.app.get('pool');
  pool.query('BEGIN', function(err, data) {
    if(err) console.log('error1');
    pool.query('INSERT INTO accounts (username, password) VALUES ($1, $2);', [signUpUsername, signUpPassword], function(err, data) {
      if(err) console.log('error2');
      if (!data) {
        console.log("already exist")
        res.send('This user already exists');
      }
      pool.query('INSERT INTO profiles (username, name, picture, address) VALUES ($1, $2, $3, $4)', [signUpUsername, signUpName, signUpPicture, signUpAddress], function(err, data) {
        if(err) console.log('error3');
        //disconnect after successful commit
        pool.query('COMMIT', function(err, data) {
          if(err) console.log('error4');
        });
        res.redirect('/login');
      });
    });
  });
});

module.exports = router;
