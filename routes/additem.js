var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('additem', { title: 'additem' });
});

router.post('/', function(req, res) {
  var itemName = req.body.itemName;
  var itemPicture = req.body.itemPicture;
  var itemPrice = req.body.itemPrice;
  var itemType = req.body.itemType;
  var itemDescription = req.body.itemDescription;

  console.log(itemName);
  console.log(itemPicture);
  console.log(itemPrice);
  console.log(itemType);
  console.log(itemDescription);
  console.log("req.user.rows[0].username = " + req.user.rows[0].username);

  var pool = req.app.get('pool');
  pool.query('BEGIN', function(err) {
    if (err) {
      console.log('begin error');
      return done(err);
    }
    pool.query('SELECT MAX(stuffid) as stuffid FROM stuff;', function(err, data) {
      if (err) {
        console.log('select stuffid error');
        return done(err);
      }
      var itemId = data.rows[0].stuffid + 1;
      console.log("itemId = " + itemId);
      pool.query('INSERT INTO stuff (stuffid, picture, name, owner, price, description) VALUES ($1, $2, $3, $4, $5, $6);', 
        [itemId, itemPicture, itemName, req.user.rows[0].username, itemPrice, itemDescription], function(err) {
        if (err) {
          console.log('insertion into stuff error');
          return done(err);
        }
        if (itemType == "deliverables") {
          var itemDeliveryCost = req.body.itemDeliveryCost;
          console.log(itemDeliveryCost);
          if (itemDeliveryCost.length == 0) {
            return res.status(400).send("Please fill up delivery cost");
          } else {
            pool.query('INSERT INTO deliverables (stuffid, deliverycost) VALUES ($1, $2);', [itemId, itemDeliveryCost], function(err) {
              if (err) {
                console.log('insertion into deliverables error');
                return done(err);
              }
              //disconnect after successful commit
              pool.query('COMMIT', function(err) {
                if (err) {
                  console.log('commit error');
                  return done(err);
                } else {
                  res.redirect('/');
                }  
              });
            });
          }
        } else if (itemType == "services") {
          pool.query('INSERT INTO services (stuffid) VALUES ($1);', [itemId], function(err, data) {
            if (err) {
              console.log('insertion into services error');
              return done(err);
            }
            //disconnect after successful commit
            pool.query('COMMIT', function(err) {
              if (err) {
                console.log('commit error');
                return done(err);
              } else {
                res.redirect('/');
              }              
            });
          });
        } else if (itemType == "pickups") {
          var itemPickupAddress = req.body.itemPickupAddress;
          console.log(itemPickupAddress);
          if (itemPickupAddress.length == 0) {
            return res.status(400).send("Please fill up pickup address");
          } else {
            pool.query('INSERT INTO pickups (stuffid, pickupaddress) VALUES ($1, $2);', [itemId, itemPickupAddress], function(err) {
              if (err) {
                console.log('insertion into pickups error');
                return done(err);
              }              
              //disconnect after successful commit
              pool.query('COMMIT', function(err) {
                if (err) {
                  console.log('commit error');
                  return done(err);
                } else {
                  res.redirect('/');
                }          
              });
            });
          }
        } else {
          pool.query('INSERT INTO intangibles (stuffid) VALUES ($1);', [itemId], function(err) {
            if (err) {
              console.log('insertion into intangibles error');
              return done(err);
            }            
            //disconnect after successful commit
            pool.query('COMMIT', function(err) {
              if (err) {
                console.log('commit error');
                return done(err);
              } else {
                res.redirect('/');
              }         
            });
          });
        }
      });
    });
  });
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on 
  if (req.isAuthenticated())
      return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

module.exports = router;
