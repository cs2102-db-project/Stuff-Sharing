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
  pool.query('SELECT MAX(stuffId) FROM stuff'), function(err, data) {
    var itemId = data[0].max + 1;
    console.log(itemId);
    pool.query('INSERT INTO stuff (stuffId, picture, name, owner, price, description) VALUES ($1::integer, $2::text, $3::text, $4::text, $5::float, $6::text);', 
      [itemId, itemPicture, itemName, currentUser.username, itemDescription], function(err, data) {
        if (err) console.log('error1');
      
      if (itemType == "deliverables") {
        if (itemDeliveryCost.length == 0) {
          return res.status(400).send("Please fill up delivery cost");
        } else {
          var itemDeliveryCost = req.body.itemDeliveryCost;
          console.log(itemDeliveryCost);
          pool.query('INSERT INTO deliverables (stuffId, price, deliveryCost) VALUES ($7::integer, $8::float, $9::float);',
            [itemId, itemPrice, itemDeliveryCost], function(err, data) {
              if (err) console.log('error2');
            });
        }

      } else if (itemType == "services") {
        pool.query('INSERT INTO services (stuffId, price) VALUES ($10::integer, $11::float);',
          [itemId, itemPrice], function(err, data) {
            if (err) console.log('error3');
          });

      } else if (itemType == "pickups") {
        if (itemPickupAddress.length == 0) {
          return res.status(400).send("Please fill up pickup address");
        } else {
          var itemPickupAddress = req.body.itemPickupAddress;
          console.log(itemPickupAddress);
          pool.query('INSERT INTO pickups (stuffId, price, pickupAddress) VALUES ($12::integer, $13::float, $14::text);',
          [itemId, itemPrice, itemPickupAddress], function(err, data) {
            if (err) console.log('error4');
          });
        }

      } else {
        pool.query('INSERT INTO intangibles (stuffId, price) VALUES ($15::integer, $16::float);',
        [itemId, itemPrice], function(err, data) {
          if (err) console.log('error5');
        });
      }
    });
    res.redirect('/');
  }
});

module.exports = router;
