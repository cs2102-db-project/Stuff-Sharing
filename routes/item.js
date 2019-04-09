var express = require('express');
var router = express.Router();
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
const borrowQuery = 'INSERT INTO Transactions(transId, loaner, loanee, itemId, loanerNum, loanerEmail, startDate, endDate, status, cost) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)'

router.get('/', function(req, res) {
    const id = req.query.stuffId;
    const user = req.app.get('current user');
    let displayMsg = "";
    let isBorrowed = false;

    if (!user) {
        res.redirect('/login');
        console.log("Login first");
    } else {
        pool.query('SELECT itemId FROM Transactions WHERE $1 = itemId AND $2 = status EXCEPT (SELECT ' +
                'stuffId FROM Services WHERE $1 = stuffId UNION SELECT stuffId FROM Intangibles WHERE ' +
                '$1 = stuffId);', [id, 'ONGOING'], (err, datum) => {
            if (err) {
                console.error("Error executing query", err.stack);
            }

            if(datum.rowCount == 0) {
                displayMsg = "Wanna borrow it? Fill out our form and click borrow now!";
            } else {
                displayMsg = "Sorry, this item is currently borrowed";
                isBorrowed = true;
            }

            pool.query(sqlQuery, [id], (err, result) => {
                if (err) {
                    console.error("Error executing query", err.stack);
                }

                res.render('item', {
                    title: 'Item',
                    user: user,
                    value: result.rows[0],
                    displayMsg: displayMsg,
                    isBorrowed: isBorrowed
                });
                console.log(result.rows[0]);
            });
        });
    }
});

router.post('/borrow', function(req, res) {
    const stuffId = req.query.stuffId;
    const num = req.body.number;
    const email = req.body.email;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const user = req.app.get('current user').username;


    if (!user) {
        res.redirect('/login');
    }
    pool.query('BEGIN', function(err, data1) {
        pool.query('SELECT MAX(transId) as transId FROM Transactions;', (err, data2) => {
            var transId = data2.rows[0].transid + 1;
            console.log("transId = " + transId);
            pool.query('SELECT * FROM Stuff WHERE stuffId = $1;',  [stuffId], (err, data3) => {
                console.log(user + " this is the current user");
                const loaner = data3.rows[0].owner;
                const cost = data3.rows[0].price;
                console.log("Loaner: " + loaner);
                pool.query(borrowQuery, [transId, loaner, user, stuffId, num, email, startDate, endDate, "PENDING", cost], (err, result) => {
                    if (err) {
                        return console.error("Error executing query", err.stack);
                    }
                    pool.query('COMMIT', function(err, data4) {
                        if(err) console.log('error1');
                    });

                    res.redirect('/');
                    return console.log(result.rows);
                });
            });
        });
    });
});

module.exports = router;
