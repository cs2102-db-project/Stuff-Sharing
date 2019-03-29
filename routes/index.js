var express = require('express');
var router = express.Router();

var queries = require('./sql');

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
  pool.query(queries.migrate_database, (err, result) => {
    if (err) {
      return console.error('Error executing migrations', err.stack)
    }
  })

  res.render('index', { title: 'Express' });
});

module.exports = router;
