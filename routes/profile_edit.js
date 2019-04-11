var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profileController');

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user == null) {
    res.redirect('/login');
  } else {
    profileController.displayEditProfileForm(req, res);
  }
});


router.post('/', function(req, res) {
  profileController.editProfile(req, res);
});

module.exports = router;