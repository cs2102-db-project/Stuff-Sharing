var express = require('express');
var router = express.Router();
var passport = require('passport');

var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function(req, res) {
    req.logout();
    res.redirect('/login')
});

module.exports = router;
