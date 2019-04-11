/* SQL Query */
var getUserProfileQuery = 'SELECT * FROM profiles WHERE username = $1';
var insertReviewQuery = 'INSERT INTO REVIEWS VALUES((SELECT max(reviewid) from REVIEWS) + 1, $1, $2, $3)';
var endTransactionQuery = "UPDATE TRANSACTIONS SET STATUS = 'FINISHED' WHERE transid=$1";
var approveTransactionQuery = "UPDATE TRANSACTIONS SET STATUS = 'ONGOING' WHERE transid=$1";
var cancelTransactionQuery = "UPDATE TRANSACTIONS SET STATUS = 'CANCELLED' WHERE transid=$1";

exports.getTransactions = function(req, res) {
  if (req.user == null) {
    res.redirect('/login');
  } else {
    var currentUser = req.user.rows[0];
    var pool = req.app.get('pool');
    pool.query("SELECT * FROM transactions NATURAL JOIN stuff NATURAL LEFT JOIN reviews WHERE transactions.loaner = $1", [currentUser.username],
      function (err1, data1) {
        pool.query("SELECT * FROM transactions NATURAL JOIN stuff NATURAL LEFT JOIN reviews WHERE transactions.loanee = $1", [currentUser.username],
          function (err2, data2) {
            var loanedOut = data1.rows;
            var loaned = data2.rows;
            console.log(loanedOut);
            console.log(loaned);
            pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
              var profile = result.rows[0];
              res.render('profile_transactions', { user: profile, loanedOut: loanedOut, loaned: loaned });
            });
          }
        );
      }
    );
  }
}

exports.addReview = function(req, res) {
    console.log("Adding review...");
    console.log(req.body);
    var pool = req.app.get('pool');
    var transid = req.body.transid;
    var rating = req.body.rating;
    var details = req.body.details;
    pool.query(insertReviewQuery, [transid, rating, details], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        return console.log(result.rows);
    });
    res.redirect('back');
}

exports.endTransaction = function(req, res) {
  console.log("Ending transaction...");
  console.log(req.body);
  var pool = req.app.get('pool');
  var transid = req.body.transid;
  pool.query(endTransactionQuery, [transid], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      return console.log(result.rows);
  });
  res.redirect('back');
}

exports.approveTransaction = function(req, res) {
  console.log("Approving transaction...");
  console.log(req.body);
  var pool = req.app.get('pool');
  var transid = req.body.transid;
  pool.query(approveTransactionQuery, [transid], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      return console.log(result.rows);
  });
  res.redirect('back');
}

exports.cancelTransaction = function(req, res) {
  console.log("Cancelling transaction...");
  console.log(req.body);
  var pool = req.app.get('pool');
  var transid = req.body.transid;
  pool.query(cancelTransactionQuery, [transid], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      return console.log(result.rows);
  });
  res.redirect('back');
}

