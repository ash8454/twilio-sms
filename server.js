// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var twilio = require('twilio');
var client = new twilio.RestClient('ACabb1b6fc87ec51a80dfda0b6a6160b88', '0f474971d45c52ecfdc3af20ca566f80');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 3900;        // set our port


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.get('/accounts', function (req, res) {
    var accounts = [
        {
            "productTypeCode":"DDA",
            "productName":"Checking"
        },
        {
            "productTypeCode":"SA",
            "productName":"Savings"
        },
        {
            "productTypeCode":"CC",
            "productName":"Credit Card"
        },
        {
            "productTypeCode":"AL",
            "productName":"Auto Loan"
        },
        {
            "productTypeCode":"HL",
            "productName":"Home Loan"
        }
    ];
    res.send(accounts);
});

router.get('/accountDetails/:account', function (req, res) {
    var obj = {
        "accountReferenceId": 126791,
        "displayAccountNumber": 123456,
        "currentBalance": 5234.99,
        "totalLoanAmount": 15999,
        "paymentDueDate": "2/15/2016",
        "paymentDueAmount": 230.55,
        "product": {
            "productName": "Checking",
            "productTypeCode": "CHK",
            "productTypeDescription": "360 Checking account"
        }
    };
    res.send(obj);
});

router.get('/account/transactions', function (req, res) {
    var obj = [
        {"transactionAmount":1000,"merchantName":"Anderson Furniture", "status":"Approved", "transactionDate":"01/10/2016"}
        ,{"transactionAmount":400,"merchantName":"Home Depot","status":"Approved", "transactionDate":"01/10/2016"}
        ,{"transactionAmount":200,"merchantName":"Sprouts", "status":"Approved", "transactionDate":"01/10/2016"}
        ,{"transactionAmount":50,"merchantName":"Walmart", "status":"Pending", "transactionDate":"01/10/2016"}
        ,{"transactionAmount":400,"merchantName":"Pottery barn", "status":"Pending", "transactionDate":"01/10/2016"}
    ];
    res.send(obj);
});

router.get('/send/:message/:phoneNumber', function (req, res) {
    //var pin = Math.floor(Math.random()*9000) + 1000+"";
    var toNumber = req.params.phoneNumber;
    var message = req.params.message;
    console.log(message, toNumber);
    sendSMS(message, toNumber);
    res.send({"Address":message});
});


var sendSMS = function(message, toPhoneNumber) {
    client.sms.messages.create({
        to: toPhoneNumber,
        from: '13025787027',
        body: 'Your nearest Capital One ATM is at '+ message
    }, function (error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:',message.sid);
            console.log('Message sent on:',message.dateCreated);
        } else {
            console.log('Oops! There was an error.', error, toPhoneNumber);
        }
    });
};


// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
