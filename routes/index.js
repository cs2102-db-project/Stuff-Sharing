var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
  let val = indexController.random('Ayush');
  res.render('index', {title: 'Ayush', value: val});
});

module.exports = router;
