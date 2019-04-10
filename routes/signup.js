var express = require('express');
var router = express.Router();
var passport = require('passport');

var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function(req, res) {
    // render the page and pass in any flash data if it exists
    res.render('login', { title: 'Login', loginMessage: req.flash('loginMessage'), signUpMessage: req.flash('signUpMessage')});
});

// process the signup form
router.post('/', passport.authenticate('local-signup', {
    successRedirect : '/profile', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the login page if there is an error
    failureFlash : true // allow flash messages
}));

module.exports = router;
