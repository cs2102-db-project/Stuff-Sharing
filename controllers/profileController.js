/* SQL Query */
var getUserProfileQuery = 'SELECT * FROM profiles WHERE username = $1';
var getUserStuffQuery = 'SELECT * FROM stuff WHERE stuff.owner = $1';
var editPasswordQuery = 'UPDATE accounts SET password = $1::text WHERE username = $2::text';
var editProfileQuery = 'UPDATE profiles SET name = $1::text, address = $2::text, picture = $3::text WHERE username = $4::text';
var getItemNumLoansQuery2 = '\
with maxItem as (\
  SELECT stuffId as stuffId, count(*) as numloans\
  FROM transactions\
  WHERE transactions.loaner = $1\
  GROUP BY stuffId\
  ORDER BY numLoans desc\
  LIMIT 1\
  )\
SELECT *\
FROM stuff natural join maxItem'
;
var getMostFrequentCustomerQuery = '\
with maxCustomer as (\
  SELECT loanee as username, count(*) as numloans\
  FROM transactions\
  WHERE transactions.loaner = $1\
  GROUP BY loanee\
  ORDER BY numLoans desc\
  LIMIT 1\
  )\
SELECT *\
FROM profiles natural join maxCustomer'
;
var getHighestRatedPersonQuery = '\
with avgRatingsGivenBy as (\
  SELECT transactions.loanee as username, avg(reviews.rating) as avgrating\
  FROM transactions natural join reviews\
  WHERE transactions.loaner = $1\
  GROUP BY loanee\
  ORDER BY avgrating desc\
  LIMIT 1\
  )\
SELECT *\
FROM profiles natural join avgRatingsGivenBy'
;
var getReviewRatings = 'with avgVoteItem as ( ' +
        'select stuff.stuffId as stuffId, stuff.name as name, avg(reviews.rating) as avgrating' +
        ' from transactions natural join reviews natural join stuff' +
        ' where stuff.owner = $1' +
        ' group by stuff.stuffId )' +
        ' select stuffId, name, avgRating ' +
        'from avgVoteItem ' +
        'where avgRating >= all( ' +
        'select avgRating ' +
        'from avgVoteItem)';


/* Gets current user's profile (which includes username, picture name, address) */
function getCurrentUserProfile(req, res) {
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');

  pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    } else {
      var profile = result.rows[0];
      return profile;
    }
  });
}
exports.getCurrentUserProfile = getCurrentUserProfile;

/* Display current user's profile along with his stuff */
exports.displayProfile = function(req, res) {
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');
  var profile = getCurrentUserProfile(req, res); // get the user out of session and pass to template
  console.log(profile);

  pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    } else {
      var profile = result.rows[0];
      pool.query(getUserStuffQuery, [currentUser.username], function(err, data) {
        var items = data.rows;
        res.render('profile', {
          user : profile,
          myItems: items
        });
      });
    }
  });
}

/* Display form to edit profile */
exports.displayEditProfileForm = function(req, res) {
  var currentUser = req.user.rows[0];
  // var profile = getCurrentUserProfile(req, res);
  // res.render('profile_edit', {user: currentUser});

  var pool = req.app.get('pool');
  pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    } else {
      var profile = result.rows[0];
      res.render('profile_edit', {user: profile});
    }
  });

}

/* Edits DB profile table */
exports.editProfile = function(req, res) {
  console.log(req.body);
  console.log(req.file);
  //get inputs
  var name = req.body.name;
  var password = req.body.password;
  var address = req.body.address;

  var picture = encodeURI(req.file.originalname);

  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');

  if (password.length != 0) {
    pool.query(editPasswordQuery, [password, currentUser.username], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
    });
  }
  pool.query(editProfileQuery, [name, address, picture, currentUser.username], (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        } else {
          console.log(result.rows[0]);
          req.app.set('current user', result.rows[0]);
          res.redirect('/profile');
        }
    });
  });
}

/* Display profile stats */
exports.displayProfileStats = function(req, res) {
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');

  pool.query(getUserProfileQuery, [currentUser.username], (err, result) => {
    var profile = result.rows[0];

    pool.query(getItemNumLoansQuery2, [currentUser.username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      } else {
        if (result.rows.length != 0) {
          var mostPopularItem = result.rows[0].name;
          var itemNumLoans = result.rows[0].numloans;
        } else {
          var mostPopularItem = 'No item';
          var itemNumLoans = 0;
        }
        pool.query(getMostFrequentCustomerQuery, [currentUser.username], (err, result) => {
          if (err) {
            return console.error('Error executing query', err.stack)
          } else {
            if (result.rows.length != 0) {
              var mostFrequentCustomer = result.rows[0].username;
              var userNumLoans = result.rows[0].numloans;
            } else {
              var mostFrequentCustomer = 'No customer';
              var userNumLoans = 0;
            }
            pool.query(getReviewRatings, [currentUser.username], (err, result2) => {
              if (err) {
                return console.log('Error executing query', err.stack);
              } else {
                if (result2.rows.length != 0) {
                  var mostVotedItem = result2.rows[0].name;
                  var avgVote = result2.rows[0].avgrating;
                } else {
                  var mostVotedItem = 'No item';
                  var avgVote = 0;
                }
                pool.query(getHighestRatedPersonQuery, [currentUser.username], (err, result) => {
                  if (err) {
                    return console.log('Error executing query', err.stack);
                  } else {
                    if (result2.rows.length != 0) {
                      var highestRatedPerson = result.rows[0].username;
                      var avgRatingPerson = result.rows[0].avgrating;
                    } else {
                      var highestRatedPerson = 'No user';
                      var avgRatingPerson = 0;
                    }
                    res.render('profile_stats', {
                      user: profile,
                      mostPopularItem: mostPopularItem,
                      itemNumLoans: itemNumLoans,
                      mostVotedItem: mostVotedItem,
                      avgVote: avgVote,
                      mostFrequentCustomer: mostFrequentCustomer,
                      userNumLoans: userNumLoans,
                      highestRatedPerson: highestRatedPerson,
                      avgRatingPerson: avgRatingPerson
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  });
};


