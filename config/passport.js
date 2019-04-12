// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        // console.log("serialize user: " + JSON.stringify(user));
        // console.log("serialize user.rows[0]: " + JSON.stringify(user.rows[0]));
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        // console.log("deserialize user.username: " + user.username);
        // console.log("deserialize user.password: " + user.password);
        done(null, user);
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // these fields are to validate the user - local strategy only uses username and password
        // the 'strings' are the names of the fields from login.ejs where form is submitted
        usernameField : 'signInUsername',
        passwordField : 'signInPassword',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username) username = username.toLowerCase(); // Use lower-case username to avoid case-sensitive username matching

        console.log("username: " + username);
        console.log("password: " + password);

        var pool = req.app.get('pool');
        pool.query('SELECT * FROM accounts WHERE accounts.username = $1 AND accounts.password = $2', [username, password], function (err, user) {
            // if no user is found, return the message
            if (user.rows[0] == undefined) {
                console.log("no user is found");
                return done(null, false, req.flash('loginMessage', 'No such user or wrong password found.'));
            } else {
                return done(null, user);
            }
        });
    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
        // these fields are to validate the user - local strategy only uses username and password
        // the 'strings' are the names of the fields from login.ejs where form is submitted
        usernameField : 'signUpUsername',
        passwordField : 'signUpPassword',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        if (username) username = username.toLowerCase(); // Use lower-case username to avoid case-sensitive username matching

        console.log("username: " + username);
        console.log("password: " + password);

        var signUpName = req.body.signUpName;
        var signUpPicture = req.body.signUpPicture;
        var signUpAddress = req.body.signUpAddress;
        console.log("name: " + signUpName);
        console.log("picture: " + signUpPicture);
        console.log("address: " + signUpAddress);

        // load connection to database
        var pool = req.app.get('pool');

        // begin transaction, don't commit unless all makes it through
        pool.query('BEGIN', function(err) {
            if(err) {
                console.log('begin error');
                return done(err);
            }
            // find a user whose username is the same as the forms username
            // we are checking to see if the user trying to login already exists
            pool.query('INSERT INTO accounts (username, password) VALUES ($1, $2);', [username, password], function(err, user) {
                // check to see if theres already a user with that username
                if (!user) {
                    console.log("This username is already taken")
                    return done(null, false, req.flash('signUpMessage', 'That username is already taken.'));
                } else {
                    pool.query('INSERT INTO nonadmins (username) VALUES ($1);', [username], function(err, user) {
                        // insert into nonadmins
                        if (err) {
                            console.log("Very weird error");
                            return done(err);
                        }
                        pool.query('INSERT INTO profiles (username, name, picture, address) VALUES ($1, $2, $3, $4)', [username, signUpName, signUpPicture, signUpAddress], function (err) {
                            if (err) {
                                console.log('insertion into profile error');
                                return done(err);
                            } else {
                                // end transaction after successful commit
                                pool.query('COMMIT', function (err) {
                                    if (err) {
                                        console.log('commit error');
                                        return done(error);
                                    } else {
                                        return done(null);
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    }));
};
