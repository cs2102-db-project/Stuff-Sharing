var express = require('express');
var router = express.Router();
var profileController = require('../controllers/profileController');
var multer = require('multer');
var fs = require('fs');

// Create directory for profile pictures if doesn't yet exist
var profilePicturesDir = "public/images/profilePictures";
if (!fs.existsSync(profilePicturesDir)) {
  fs.mkdirSync(profilePicturesDir);
}
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, profilePicturesDir);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage });

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user == null) {
    res.redirect('/login');
  } else {
    profileController.displayEditProfileForm(req, res);
  }
});

router.post('/', upload.single('profilePic'), function(req, res) {
  console.log("hi")
  profileController.editProfile(req, res);
});

module.exports = router;