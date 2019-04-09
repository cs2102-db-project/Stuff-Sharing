var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  } else {
  	var pool = req.app.get('pool');
  	pool.query("SELECT * FROM transactions WHERE transactions.loaner = $1::text", [currentUser.username], (err, data) => {
      pool.query("SELECT * FROM transactions WHERE transactions.loanee = $1::text", [currentUser.username], (err, data2) => {
        var loanedOut = data.rows;
        var loaned = data2.rows;
        res.render('profile_transactions', { user: currentUser, loanedOut: loanedOut, loaned: loaned });
      });
    });
  }
});

module.exports = router;