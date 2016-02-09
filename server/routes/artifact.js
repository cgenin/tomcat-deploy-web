var express = require('express');
var deploydb = require('../deploydb');
var router = express.Router();
var bodyParser = require('body-parser');

/* GET users listing. */

router.post('/', bodyParser.json(), function (req, res, next) {
    var body = req.body;
    var files = deploydb.files();
    var tmpHttp = (body.url.indexOf('http://') === -1) ? 'http://' + body.url : body.url;
    deploydb.insert(files, {
        name: body.name, url: tmpHttp
    });
    res.json(body);
});

router.delete('/', bodyParser.json(), function (req, res, next) {
    var body = req.body;
    var files = deploydb.files();
    deploydb.remove(files, body);
    res.json(body);
});

module.exports = router;