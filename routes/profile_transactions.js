var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  } else {
  	var pool = req.app.get('pool');
  	pool.query("SELECT * FROM transactions NATURAL LEFT JOIN reviews WHERE transactions.loaner = $1", [currentUser.username],
      function(err1, data1) {
        pool.query("SELECT * FROM transactions NATURAL LEFT JOIN reviews WHERE transactions.loanee = $1", [currentUser.username],
          function(err2, data2) {
            var loanedOut = data1.rows;
            var loaned = data2.rows;
            console.log(loanedOut);
            console.log(loaned);
            res.render('profile_transactions', { user: currentUser, loanedOut: loanedOut, loaned: loaned });
          }
        );
      }
    );
  }
});

module.exports = router;