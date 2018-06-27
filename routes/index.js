var express = require('express');
var router = express.Router();
var AWS = require('aws-sdk');
const UserClass = require('../UserClass');

/* GET home page. */
router.get('/', function(req, res) {
    res.status(200);
    res.render("index", {
        user: req.app
    });
    res.sendStatus(200);
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', {title:res.app.locals.title});
    res.status(200).end();
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    // Create DynamoDB service object
    var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

    var params = {
        TableName: 'Users'
    };

    ddb.scan(params, function(err, data) {
        if (err) {
            console.log("Error", err);
        }
        else {
            console.log("Success");
            res.render('userlist', { "userlist": data.Items });

        }
    });
});

/* GET New User page. */
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Add New User' });
});

/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    const myUser = new UserClass();
    myUser.createdAt = new Date();
    myUser.username = userName;
    myUser.email = userEmail;


    db.put({ item: myUser }).then(() => {
        // The user has been created!
        console.log(myUser.email);
        // Set our collection
    }).catch((error) => {
        console.log(error, 'Danger! Danger! Will Robinson!');
    });

    res.render('added', { "user": myUser, "title": "Added " });
});


module.exports = router;
