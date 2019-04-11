/* SQL Query */
var getUserProfileQuery = 'SELECT * FROM profiles WHERE username = $1';
var getUserStuffQuery = 'SELECT * FROM stuff WHERE stuff.owner = $1';
var editPasswordQuery = 'UPDATE accounts SET password = $1::text WHERE username = $2::text';
var editProfileQuery = 'UPDATE profiles SET name = $1::text, address = $2::text WHERE username = $3::text';
var getItemNumLoansQuery = '\
with itemCount as (\
  SELECT transactions.stuffId as stuffId, count(*) as numLoans\
  FROM transactions\
  WHERE transactions.loanee = $1\
  GROUP BY stuffId\
  )\
SELECT *\
FROM stuff natural join itemCount\
WHERE stuff.stuffId = itemCount.stuffId and itemCount.numLoans = (SELECT max(numLoans) FROM itemCount)';
var getItemNumLoansQuery2 = '\
with maxItem as (\
  SELECT stuffId as stuffId, count(*) as numLoans\
  FROM transactions\
  WHERE transactions.loaner = $1\
  GROUP BY stuffId\
  ORDER BY numLoans desc\
  LIMIT 1\
  )\
SELECT *\
FROM stuff natural join maxItem'
;


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
  //get inputs
  var name = req.body.name;
  var password = req.body.password;
  var address = req.body.address;

  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');

  if (password.length != 0) {
    pool.query(editPasswordQuery, [password, currentUser.username], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
    });
  }
  pool.query(editProfileQuery, [name, address, currentUser.username], (err, result) => {
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
        var mostPopularItem = result.rows[0];
        res.render('profile_stats', { user: profile, mostPopularItem: mostPopularItem });
      }
    });
  });
}


