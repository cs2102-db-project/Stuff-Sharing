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

exports.random = function(randomData) {
    return [1,2,3,4];
};

exports.renderAllSearch = function(res) {
    console.log('hi')
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
    pool.query(searchQuery, [keyword], (err, result) => {
        console.log(keyword);
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
