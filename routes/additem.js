var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

// middleware for bodyParser
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('addItem', { title: 'addItem' });
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

  if (itemName.length == 0 || itemPrice.length == 0 || itemType.length == 0 || itemDescription.length == 0) {
    return res.status(400).send("Please fill up all the fields");
  }

  var currentUser = req.app.get('current user');
  if (currentUser == null) {
    res.redirect('/login');
  }

  var pool = req.app.get('pool');
  pool.query('BEGIN', function(err, data) {
    pool.query('SELECT MAX(stuffid) as stuffid FROM stuff;', function(err, data) {
      var itemId = data.rows[0].stuffid + 1;
      console.log("itemId = " + itemId);
      pool.query('INSERT INTO stuff (stuffid, picture, name, owner, price, description) VALUES ($1, $2, $3, $4, $5, $6);', 
        [itemId, itemPicture, itemName, currentUser.username, itemPrice, itemDescription], function(err, data) {
          if (err) console.log('stuff error');
        
        if (itemType == "deliverables") {
          var itemDeliveryCost = req.body.itemDeliveryCost;
          console.log(itemDeliveryCost);
          if (itemDeliveryCost.length == 0) {
            return res.status(400).send("Please fill up delivery cost");
          } else {
            pool.query('INSERT INTO deliverables (stuffid, deliverycost) VALUES ($1, $2);', [itemId, itemDeliveryCost], function(err, data) {
              if (err) console.log('deliverables error');
              //disconnect after successful commit
              pool.query('COMMIT', function(err, data) {
                if(err) console.log('error1');
              });
            });
          }
        } else if (itemType == "services") {
          pool.query('INSERT INTO services (stuffid) VALUES ($1);', [itemId], function(err, data) {
            if (err) console.log('services error');
            //disconnect after successful commit
            pool.query('COMMIT', function(err, data) {
              if(err) console.log('error2');
            });
          });
        } else if (itemType == "pickups") {
          var itemPickupAddress = req.body.itemPickupAddress;
          console.log(itemPickupAddress);
          if (itemPickupAddress.length == 0) {
            return res.status(400).send("Please fill up pickup address");
          } else {
            pool.query('INSERT INTO pickups (stuffid, pickupaddress) VALUES ($1, $2);', [itemId, itemPickupAddress], function(err, data) {
              if (err) console.log('pickups error');
              //disconnect after successful commit
              pool.query('COMMIT', function(err, data) {
                if(err) console.log('error3');
              });
            });
          }
        } else {
          pool.query('INSERT INTO intangibles (stuffid) VALUES ($1);', [itemId], function(err, data) {
            if (err) console.log('intangibles error');
            //disconnect after successful commit
            pool.query('COMMIT', function(err, data) {
              if(err) console.log('error4');
            });
          });
        }

      });
      res.redirect('/');
    });
  });
});

module.exports = router;
