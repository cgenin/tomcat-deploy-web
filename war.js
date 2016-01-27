var http = require('http'),
    fs = require('fs'),
    URL = require('url'),
    Q = require('q'),
    downloadedDir = 'download';

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

var warname = function (name) {
    return name + '.war';
};

var fullpath = function (name) {
    return downloadedDir + '/' + warname(name);
};
var managedOld = function (item) {
    var deferred = Q.defer(),
        name = item.name,
        path = fullpath(name);
    fs.stat(path, function (err) {
        if (err) {
            deferred.resolve(false);
            return;
        }
        fs.renameSync(path, path + '.' + new Date().getTime());
        deferred.resolve(true);
    });
    return deferred.promise;
};

var download = function (item) {
    var deferred = Q.defer();
    try {
        var name = item.name,
            url = item.url,
            war = warname(name),
            path = fullpath(name);
        var file = fs.createWriteStream(path);
        http.get(url, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close(function () {
                    deferred.resolve(war);
                });
            });
        }).on('error', function (err) {
            fs.unlink(path);
            deferred.reject(err);
        });
    } catch (e) {
        console.error(e);
        deferred.reject(e);
    }
    return deferred.promise;
};

var host = function (configuration) {
    return 'http://' + configuration.hostname;
};

var deploy = function (configuration, item) {
    var deferred = Q.defer(),
        root = host(configuration),
        parsingUrl = URL.parse(root),
        url = root + '/manager/text/deploy?path=/' + item.name + '&update=true';
    var options = {
        host: parsingUrl.hostname,
        method: "PUT",
        port: parsingUrl.port,
        path: url,//I don't know for some reason i have to use full url as a path
        auth: configuration.user.name + ':' + configuration.user.password
    };
    var req = http.request(options, function (rs) {
        var result = "";
        rs.on('data', function (data) {
            result += data;
        });
        rs.on('end', function () {
            if (rs.statusCode === 200) {
                deferred.resolve(result);
            } else {
                deferred.reject(rs);
            }

        });
    }).on('error', function (e) {
        deferred.reject(e);
    });

    fs.readFile(fullpath(item.name), function (err, data) {
        if (err) {
            deferred.reject(err);
        } else {
            req.end(data);
        }
    });

    return deferred.promise;
};

var undeploy = function (configuration, item) {
    var deferred = Q.defer(),
        root = host(configuration),
        parsingUrl = URL.parse(root),
        url = root + '/manager/text/undeploy?path=/' + item.name;
    var options = {
        host: parsingUrl.hostname,
        method: "GET",
        port: parsingUrl.port,
        path: url,//I don't know for some reason i have to use full url as a path
        auth: configuration.user.name + ':' + configuration.user.password
    };

    http.get(options, function (rs) {
        var result = "";
        rs.on('data', function (data) {
            result += data;
        });
        rs.on('end', function () {
            //console.log(result);

            if (rs.statusCode === 200) {
                deferred.resolve(result);
            } else {
                deferred.reject(rs);
            }

        });
    }).on('error', function (e) {
        deferred.reject(e);
    });
    return deferred.promise;
};

module.exports = {
    makedirectory: makeDirectory,
    managedOld: managedOld,
    download: download,
    undeploy: undeploy,
    deploy: deploy
};