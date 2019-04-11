/* SQL Query */
var getUserProfileQuery = 'SELECT * FROM profiles WHERE username = $1';
var getUserStuffQuery = 'SELECT * FROM stuff WHERE stuff.owner = $1';
var editProfileAllQuery = 'UPDATE profiles SET name = $1::text, password = $2::text, address = $3::text WHERE username = $4::text';
var editProfileKeepPwdQuery = 'UPDATE profiles SET name = $1::text, address = $2::text WHERE username = $3::text';


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

exports.editProfile = function(req, res) {
  //get inputs
  var name = req.body.name;
  var password = req.body.password;
  var address = req.body.address;

  //queries
  var currentUser = req.user.rows[0];
  var pool = req.app.get('pool');

  if (password.length != 0) {
    pool.query(editProfileAllQuery, [name, password, address, currentUser.username], (err, result) => {
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
  } else {
    pool.query(editProfileKeepPwdQuery, [name, address, currentUser.username], (err, result) => {
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
}


