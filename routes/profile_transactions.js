var express = require('express');
var router = express.Router();
var transactionsController = require('../controllers/transactionsController');

/* GET home page. */
router.get('/', function (req, res, next) {
  transactionsController.getTransactions(req, res);
});

/* End Transaction */
router.post('/endtrans', function (req, res, next) {
  transactionsController.endTransaction(req, res);
});

/* Add review */
router.post('/addReview', function (req, res, next) {
  transactionsController.addReview(req, res);
});

module.exports = router;