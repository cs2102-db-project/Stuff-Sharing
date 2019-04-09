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
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {
        if (username)
            username = username.toLowerCase(); // Use lower-case username to avoid case-sensitive username matching

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'local.username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
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

            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            pool.query('INSERT INTO accounts (username, password) VALUES ($1, $2);', [username, password], function(err, user) {
            
                // if there are any errors
                if(err) console.log('insertion into accounts error');

                // check to see if theres already a user with that username
                if (!user) {
                    console.log("This username is already taken")
                    // res.send('This username is already taken');
                    // req.flash('signupMessage', 'That username is already taken.');
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    // also insert into profiles
                    pool.query('INSERT INTO profiles (username, name, picture, address) VALUES ($1, $2, $3, $4)', [username, signUpName, signUpPicture, signUpAddress], function(err) {
                        if(err) console.log('insertion into profile error');
                        // end transaction after successful commit
                        pool.query('COMMIT', function(err) {
                            if(err) console.log('commit error');
                        });
                    });
                }
            });    
        return done(null);
        });
    }));
};
