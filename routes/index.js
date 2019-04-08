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
    indexController.renderSearch(res);
});

/* Search feature */
router.post('/search', function(req, res, next) {
    let keyword = req.body.keyword;
    indexController.renderSearch(res, keyword);
});

module.exports = router;
