var express = require('express');
var deploydb = require('../deploydb');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    var config = deploydb.config() || {data: [{}]};
    var items = deploydb.files() || {data: []};
    res.json({
        server: config.data[0],
        items: items.data
    });
});


module.exports = router;

