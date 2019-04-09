var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

/* GET home page. */
router.get('/', function(req, res, next) {
    indexController.renderAll(req, res);
});

/* Search */
router.get('/search', function(req, res, next) {
    indexController.renderSearch(req, res);
});

/* Browse category */
router.get('/category', function(req, res, next) {
    indexController.renderCategory(req, res);
})

module.exports = router;
