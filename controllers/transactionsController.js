/* SQL Query */
var insertReviewQuery = 'INSERT INTO REVIEWS VALUES((SELECT max(reviewid) from REVIEWS) + 1, $1, $2, $3)';

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
    res.redirect('/profile_transactions');
}