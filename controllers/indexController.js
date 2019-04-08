const { Pool } = require('pg')
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stuffsharing',
    password: 'postgres',
    port: 5432,
  })
  
/* SQL Query */
var allQuery = 'SELECT * from Stuff';
var searchQuery = 'SELECT * from Stuff where name=$1';
var categoryQuery = (keyword) => `SELECT * from Stuff natural join ${keyword}`; // no sanitization here because pg doesn't allow placeholder for table identifiers

exports.random = function(randomData) {
    return [1,2,3,4];
};

exports.renderAllSearch = function(res) {
    console.log("Displaying all stuff...");
    pool.query(allQuery, (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        res.render('index',
            {title: 'Stuff Sharing',
             value: result.rows});
        return console.log(result.rows);
    });
}

exports.renderSearch = function(res, keyword) {
    console.log("Displaying searched stuff...");
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

exports.renderCategory = function(res, keyword) {
    console.log("Displaying category...");
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
