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
const borrowQuery = '';

router.get('/', function(req, res) {
    let id = req.query.stuffId;
    const user = req.app.get('current user');

    pool.query(sqlQuery, [id], (err, result) => {
        if (err) {
            console.error("Error executing query", err.stack);
        }
        res.render('item', { title: 'Item', user: user, value: result.rows[0]});
        console.log(result.rows[0]);
    });
});

router.post('/borrow', function(req, res) {
    const id = req.query.stuffId;
    const num = req.body.number;
    const email = req.body.email;
    const user = req.app.get('current user');

    pool.query(borrowQuery, [id, num, email], (err, result) => {
        if (err) {
            return console.error("Error executing query", err.stack);
        }

        if (!user) {
            res.redirect('/login');
        }

        res.render('item',
                {});
        return console.log(result.rows);
    });
});

module.exports = router;
