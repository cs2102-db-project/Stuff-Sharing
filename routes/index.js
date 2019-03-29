var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

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

module.exports = router;
