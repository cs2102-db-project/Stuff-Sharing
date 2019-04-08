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
    indexController.renderAll(res);
});

/* Search */
router.get('/search', function(req, res, next) {
    let keyword = req.query.keyword;
    indexController.renderSearch(res, keyword);
});

/* Browse category */
router.get('/category', function(req, res, next) {
    let keyword = req.query.keyword;
    console.log(keyword);
    indexController.renderCategory(res, keyword);
})

module.exports = router;
