var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

/* SQL Query */
var allQuery = 'SELECT * from Stuff';
var searchQuery = 'SELECT * from Stuff where name=$1';

const { Pool } = require('pg')
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'stuffsharing',
  password: 'postgres',
  port: 5432,
})


/* GET home page. */
router.get('/', function(req, res, next) {
    pool.query(allQuery, (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             value: result.rows});
        return console.log(result.rows);
    });
});

/* Search feature */
router.post('/search', function(req, res, next) {
    let keyword = req.body.keyword;
    pool.query(searchQuery, [keyword], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             value: result.rows});
        return console.log(result.rows);
    });
});

module.exports = router;
