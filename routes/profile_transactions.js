var express = require('express');
var router = express.Router();
var transactionsController = require('../controllers/transactionsController');

/* GET home page. */
router.get('/', function (req, res, next) {
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');
  pool.query("SELECT * FROM transactions NATURAL LEFT JOIN reviews WHERE transactions.loaner = $1", [currentUser.username],
    function (err1, data1) {
      pool.query("SELECT * FROM transactions NATURAL LEFT JOIN reviews WHERE transactions.loanee = $1", [currentUser.username],
        function (err2, data2) {
          var loanedOut = data1.rows;
          var loaned = data2.rows;
          console.log(loanedOut);
          console.log(loaned);
          res.render('profile_transactions', { user: currentUser, loanedOut: loanedOut, loaned: loaned });
        }
      );
    }
  );
});

/* End Transaction */
router.post('/endtrans', function (req, res, next) {
  transactionsController.endTransaction(req, res);
});

/* Add review */
router.post('/addReview', function (req, res, next) {
  transactionsController.addReview(req, res);
});

module.exports = router;