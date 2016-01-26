var express = require('express');
var deploydb = require('../deploydb');
var router = express.Router();
var bodyParser = require('body-parser');

var startSees = function (res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    res.write("\n");

    return function sendSse(name, data, id) {
        res.write("event: " + name + "\n");
        if (id) res.write("id: " + id + "\n");
        res.write("data: " + JSON.stringify(data) + "\n\n");
    }
};

router.delete('/', bodyParser.json(), function (req, res, next) {
    var undeploy = req.body;
    var war = require('../war');
    var sse = startSees(res);
    undeploy.forEach(function (o) {
        sse({message: 'deploy : ' + o.name});
        war.undeploy(configuration, o).then(function (name) {
            sse({message: 'undeployed : ' + name});
        }, function (err) {
            console.error(err);
            sse({error: 'error in undeploying'});
            sse({error: err});
        });
        res.end();
    });

});

module.exports = router;

