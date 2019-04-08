var express = require('express');
var router = express.Router();
var indexController = require('../controllers/indexController');

/* SQL Query */
var allQuery = 'SELECT * from Stuff';
var adsQuery = 'SELECT * from Stuff WHERE EXISTS (SELECT 1 FROM ads WHERE stuff.stuffId = ads.stuffId)';
var searchQuery = 'SELECT * from Stuff where name=$1';

/* GET home page. */
router.get('/', function(req, res, next) {
    var pool = req.app.get('pool');

    pool.query(allQuery, (err, result) => {
	    pool.query(adsQuery, (err2, result2) => {
	    	if (err | err2) {
	    		return console.error('Error executing query', err.stack)
	    	}
	    	console.log(result2.rows);
	        res.render('index', {
	        	title: 'Stuff Sharing',
				stuff: result.rows,
				ads: result2.rows
         	});
	    });
    });
});

/* Search feature */
router.post('/search', function(req, res, next) {
    var pool = req.app.get('pool');
    let keyword = req.body.keyword;
    pool.query(searchQuery, [keyword], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             stuff: result.rows});
        return console.log(result.rows);
    });
});

module.exports = router;
