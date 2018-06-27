var express = require('express');
const UserClass = require('../UserClass');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
    var mapper = req.db;
    const collection = mapper.scan({
        valueConstructor: UserClass
    });

    res.render('userlist', {
        "userlist": collection
    });
});

module.exports = router;
