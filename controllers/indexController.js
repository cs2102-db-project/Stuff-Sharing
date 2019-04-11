/* SQL Query */
var allQuery = 'SELECT * from Stuff';
var searchQuery = 'SELECT * from Stuff where name=$1';
var categoryQuery = (keyword) => `SELECT * from Stuff natural join ${keyword}`; // no sanitization here because pg doesn't allow placeholder for table identifiers
var adsQuery = 'SELECT * from Stuff WHERE EXISTS (SELECT 1 FROM ads WHERE stuff.stuffId = ads.stuffId)';

exports.random = function(randomData) {
    return [1,2,3,4];
};

exports.renderAll = function(req, res) {
    console.log("Displaying all stuff...");
    var pool = req.app.get('pool');
    pool.query(allQuery, (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        pool.query(adsQuery, (err2, result2) => {
            var ads = result2.rows;
            res.render('index',
                {title: 'Stuff Sharing',
                 value: result.rows,
                 ads: ads
                });
            return console.log(result.rows);
        });
    });
}

exports.renderSearch = function(req, res) {
    console.log("Displaying searched stuff...");
    var pool = req.app.get('pool');
    var keyword = req.query.keyword;
    pool.query(searchQuery, [keyword], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             value: result.rows});
        return console.log(result.rows);
    });
}

exports.renderCategory = function(req, res) {
    console.log("Displaying category...");
    var pool = req.app.get('pool');
    var keyword = req.query.keyword;
    pool.query(categoryQuery(keyword), (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             value: result.rows});
        return console.log(result.rows);
    });
}

// Add more functions over here for using with the routes. Have a route for each individual action, and a corresponding
// function. Need to read up more on POST commands though, because I guess that the extra data that would be coming in would be
// stored as the headers/ URL parameters.
