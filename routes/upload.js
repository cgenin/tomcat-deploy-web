var express = require('express'),
    multer = require('multer'),
    deploydb = require('../deploydb'),
    fs = require('fs'),
    Q = require('q'),
    router = express.Router(),
    downloadedDir = __dirname + '/../public/uploads';


var storage = multer({
    dest: downloadedDir
});


router.post('/', storage.single('war'), function (req, res, next) {
    var now = new Date();
    var name = req.file.originalname;
    var filename = req.file.filename;
    var p = req.file.path;
    var collection = deploydb.getCollection();
    deploydb.save(collection, {dt: now, name: name, filename: filename, path: p});
    res.set('Location', '/api/old-version/war/' + filename).status(204).end();
});

function sendWarFile(dbDatas, res) {
    var stat = fs.statSync(dbDatas.path);
    res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Length': stat.size,
        'Content-Disposition': 'attachment; filename=' + dbDatas.name
    });

    var readStream = fs.createReadStream(dbDatas.path);
    readStream.pipe(res);
}
router.get('/war/:filename', function (req, res, next) {
    var filename = req.params.filename;
    var collection = deploydb.getCollection();
    var result = collection.find({'filename': filename});

    if (result && result.length > 0) {
        var dbDatas = result[0];
        sendWarFile(dbDatas, res);
        return;
    }

    res.status(404).end();
});

router.get('/last/:name', function (req, res, next) {
    var name = req.params.name;
    var collection = deploydb.getCollection();
    var result = collection.find({'name': name});

    if (result && result.length > 0) {
        var sorted = result.sort(function (a, b) {
            var dtA = a.dt;
            var dtB = b.dt;
            if (dtA < dtB) return 1;
            if (dtA > dtB) return -1;
            return 0;

        });
        var last = sorted[0];
        sendWarFile(last, res);
        return;
    }
    res.status(404).end();
});


router.get('/', function (req, res, next) {
    var collection = deploydb.getCollection();
    res.json(collection.data);
});


var makeDirectory = function () {
    var deferred = Q.defer();

    fs.stat(downloadedDir, function (exist) {
        if (!exist) {
            deferred.resolve(downloadedDir);
            return;
        }
        fs.mkdir(downloadedDir, function (err) {
            if (err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(downloadedDir);
        });
    });
    return deferred.promise;
};

makeDirectory().then(function () {
    console.log('Download dir created');
}, function (err) {
    console.err('Download dir Error');
    console.err(err);
});


module.exports = router;