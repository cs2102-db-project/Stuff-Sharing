var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// var bodyParser   = require('body-parser');
var passport = require('passport');
var flash    = require('connect-flash');
var session = require('express-session'); // Each browser gets one session, if client A and B logs in on the same browser, data is overwritten by the later login

require('./config/passport')(passport); // pass passport for configuration

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var logoutRouter = require('./routes/logout');
var signupRouter = require('./routes/signup')
var profileRouter = require('./routes/profile');
var profileTransactionsRouter = require('./routes/profile_transactions');
var transactionRouter = require('./routes/transaction');
var profileEditRouter = require('./routes/profile_edit');
var profileStatsRouter = require('./routes/profile_stats');
var addItemRouter = require('./routes/additem');
var itemRouter = require('./routes/item');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// required for passport
app.use(session({ secret: 'stuffsharing' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions 
app.use(flash()); // use connect-flash for flash messages stored in session

// Connect to database and create query pool
const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stuffsharing',
  password: 'postgres',
  port: 5432,
})
app.set('pool', pool);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // read cookies (needed for auth)
// app.use(bodyParser()); // get information from html forms
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/signup', signupRouter);
app.use('/profile', profileRouter);
app.use('/profile_transactions', profileTransactionsRouter);
app.use('/transaction', transactionRouter);
app.use('/profile_edit', profileEditRouter);
app.use('/profile_stats', profileStatsRouter);
app.use('/additem', addItemRouter);
app.use('/item', itemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// parse GET requests
// app.use(bodyParser.urlencoded({ extended: false }));  
// app.use(bodyParser.json());

module.exports = app;
