var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

// var queries = require('./sql');
/* SQL Query */
var sqlQuery = keyword => `SELECT * from Stuff where name = '${keyword}'`;

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
  let val = indexController.random('Ayush');
  res.render('index', {title: 'Stuff Sharing', value: val});
});

/* Search feature */
router.post('/search', function(req, res, next) {
    let keyword = req.body.keyword;
    let query = sqlQuery(keyword);
    console.log(query);
    pool.query(query, (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        return console.log(result.rows[0]);
    });
});

module.exports = router;
