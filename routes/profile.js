var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  } else {
  	var pool = req.app.get('pool');
  	pool.query("SELECT * FROM stuff WHERE stuff.owner = $1::text", [currentUser.username],
      function(err, data) {
        var items = data.rows;
        res.render('profile', { user: currentUser, myItems: items });
      }
    );
  }
});

module.exports = router;

// var path = require('path');
// var db = require('pg');
// var app = express();


// var dbConnection = "postgres://postgres:root@localhost:5432/Phonebook";


// // Form Handling - Update Row / Delete Row

// app.get('/handleForm',function(req,res){
//     var dbClient = new db.Client(dbConnection);

//     dbClient.connect(function(err){
//         if(err)
//             throw err;

//         if(req.query.deleteBtn != null){

//             var query = "delete from Contacts where id = ($1)";
//             var id = [req.query.id];

//             dbClient.query(query , id , function(err){
//                 if(err)
//                     throw err;
//                 else {
//                     console.log('Contact Deleted!') ;
//                     res.redirect('/contacts.html');     
//                     res.end();
//                 }               
//             });
//         } else if(req.query.updateBtn != null) {
//             var query = "update Contacts set fullname=($1),phone=($2),mobile=($3),address=($4) where phone=($5)";
//             var fullname = req.query.fullname;
//             var phone = req.query.phone;
//             var phoneHidden = req.query.phoneHidden;
//             var mobile = req.query.mobile;
//             var address = req.query.address;            

//             dbClient.query(query , [fullname,phone,mobile,address,phoneHidden], function(err){
//                 if(err)
//                     throw err;
//                 else {
//                     console.log('Contact Updated!') ;
//                     res.redirect('/contacts.html');     
//                     res.end();
//                 }               
//             });         
//         }

//     });
// });


// // Search contact by phone

// app.get('/searchContact',function(req,res) {
//     var dbClient = new db.Client(dbConnection);

//     dbClient.connect(function(err){
//         if(err)
//             throw err;

//         var query = "select * from Contacts where phone=($1)";
//         var searchBoxValue = req.query.searchBoxValue;

//         dbClient.query(query , [searchBoxValue], function(err,result){
//             if(err)
//                 throw err;
//             else {
//                 res.render('searchedContact.ejs' , {contacts: result});
//                 res.end();
//             }               
//         }); 
//     });
// });

// // Show Contact's Table

// app.get('/contacts.html',function(req,res) {
//     var dbClient = new db.Client(dbConnection);

//     dbClient.connect(function(err){
//         if(err)
//             throw err;

//         var query = "select * from Contacts";

//         dbClient.query(query,function(err,result){
//             if(err)
//                 throw err;
//             else {

//                 res.render('contacts.ejs', { contacts: result });
//                 res.end();
//             }
//         });
//     });
// });

// app.listen(8080,function(){
//     console.log('Server started');
// });
