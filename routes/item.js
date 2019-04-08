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

router.get('/', function(req, res) {
    let id = req.query.stuffId;
    let stuff = itemController.random(id);
    res.render('item', {stuffFields: stuff, title: "Item"});
});

module.exports = router;
