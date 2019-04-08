var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  } else {
  	var pool = req.app.get('pool');
  	pool.query("SELECT * FROM transactions WHERE transactions.loaner = $1::text", [currentUser.username],
      function(err, data) {
        var loanedOut = data.rows;
        res.render('profile_transactions', { user: currentUser, loanedOut: loanedOut, loaned: loanedOut });
      }
    );
  }
});

module.exports = router;