var express = require('express');
var router = express.Router();
var EventEmitter = require('events');
var util = require('util');
var itemController = require('../controllers/itemController');

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stuffsharing',
  password: 'postgres',
  port: 5432,
});

const sqlQuery = 'SELECT * from Stuff where stuffid=$1';
const borrowQuery = 'INSERT INTO Transactions(transId, loanee, stuffid, loaneeContact, loaneeEmail, startDate, endDate, status, cost, bid) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'

router.get('/', isLoggedIn, function(req, res) {
    const id = req.query.stuffId;
    let displayMsg = "";
    let isBorrowed = false;

    pool.query('SELECT stuffid FROM Transactions WHERE $1 = stuffid AND $2 = status EXCEPT (SELECT ' +
            'stuffId FROM Services WHERE $1 = stuffId UNION SELECT stuffId FROM Intangibles WHERE ' +
            '$1 = stuffId);', [id, 'ONGOING'], (err, datum) => {
        if (err) {
            console.error("Error executing query", err.stack);
            return 0;
        }

        if(datum.rowCount == 0) {
            displayMsg = "Wanna borrow it? Fill out our form and click borrow now!";
        } else {
            displayMsg = "Sorry, this item is currently borrowed";
            isBorrowed = true;
        }

        pool.query('SELECT * FROM Stuff WHERE $1 = stuffId;', [id], (err, ownerRes) => {
            if (err) {
                console.log("Error executing query", err.stack);
                return 0;
            }
            console.log("ownerRes: " + JSON.stringify(ownerRes));
            const owner = ownerRes.rows[0].owner;
            if (owner == req.user.rows[0].username) {
                displayMsg = "This item belongs to you";
                isBorrowed = true;
            }
            pool.query(sqlQuery, [id], (err, result) => {
                if (err) {
                    console.error("Error executing query", err.stack);
                    return 0;
                }

                res.render('item', {
                    title: 'Item',
                    value: result.rows[0],
                    displayMsg: displayMsg,
                    isBorrowed: isBorrowed,
                    displayDelete: true
                });
                console.log(result.rows[0]);
                return 0;
            });
        });
    });
});

router.post('/borrow', function(req, res) {
    const stuffId = req.query.stuffId;
    const contact = req.body.contact;
    const email = req.body.email;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const bid = req.body.bid;
    const user = req.user.rows[0].username;

    pool.query('BEGIN', function(err, data1) {
        pool.query('SELECT MAX(transId) as transId FROM Transactions;', (err, data2) => {
            if (err) {
                return console.log(err);
            }
            var transId = data2.rows[0].transid + 1;
            console.log("transId = " + transId);
            pool.query('SELECT * FROM Stuff WHERE stuffId = $1;',  [stuffId], (err, data3) => {
                if (err) {
                    return console.log(err);
                }
                console.log(user + " this is the current user");
                const cost = data3.rows[0].price;
                pool.query(borrowQuery, [transId, user, stuffId, contact, email, startDate, endDate, "PENDING", cost, bid], (err, borrowResult) => {
                    console.log(borrowQuery, [transId, user, stuffId, contact, email, startDate, endDate, "PENDING", cost, bid]);
                    if (err) {
                        console.log("There's an error matey" + err);

                        res.render('item', {
                            title: 'Item',
                            value: data3.rows[0],
                            displayMsg: err,
                            isBorrowed: true,
                            displayDelete: true
                        });
                        return 0;
                    }
                    console.log("No error, this is the result " + borrowResult.rows);
                    console.log("And this is what the error is " + err)
                    pool.query('COMMIT', function(err, data4) {
                        if(err) console.log('error1');
                    });

                    res.redirect('/');
                    return console.log(borrowResult.rows);
                });
            });
        });
    });
});

router.post('/delete', isLoggedIn, function(req, res) {
  const stuffId = req.query.stuffId;
  const currentUser = req.user.rows[0].username;
  console.log(currentUser + " is current user");
  pool.query('SELECT * FROM Stuff WHERE stuffId=$1', [stuffId], (err, data3) => {
      if (err) {
          console.log(err + " weird error");
          return 0;
      }
      const owner = data3.rows[0].owner;
      console.log(owner + " is owner");
      pool.query('SELECT Count(*) as numAdmin from Admins where username=$1', [currentUser], (err, adminStatus) => {
          if (err) {
              return console.log("Some weird error " + err);
          }
          const numAdmin = adminStatus.rows[0].numadmin;
          console.log(numAdmin + " numAdmin");
          console.log(owner != currentUser);
          console.log(numAdmin == 0 + " !numAdmin");
          console.log(!numAdmin && owner != currentUser);
          if (numAdmin == 0 && owner != currentUser) {
              res.render('item', {
                  title: 'Item',
                  value: data3.rows[0],
                  displayMsg: "You do not have the permission to delete the item",
                  isBorrowed: true,
                  displayDelete: false
              });
              return 0;
          } else {
              pool.query('DELETE FROM Stuff WHERE stuffId=$1', [stuffId], (err, response) => {
                  if (err) {
                      res.render('item', {
                          title: 'Item',
                          value: data3.rows[0],
                          displayMsg: err,
                          isBorrowed: true,
                          displayDelete: true
                      });
                      return 0;
                  } else {
                      res.redirect('/');
                      return 0;
                  }
              });
          }
      });
  });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router;
