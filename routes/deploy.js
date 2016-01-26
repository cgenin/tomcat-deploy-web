var deploydb = require('../deploydb');
var remoteConsole = function (io) {
    return {
        error: function (msg) {
            io.emit('rc-error', msg);
        },
        log: function (msg) {
            io.emit('rc-log', msg);
        },
        end: function () {
            io.emit('rc-end', {});
        }
    };
};


module.exports = function (io) {
    var war = require('../war'),
        rc = remoteConsole(io);

    io.on('undeploy', function (data) {
        var recursiveUndeploy = function (artifacts) {
            if (!artifacts || artifacts.length === 0) {
                rc.end();
                return;
            }

            try {
                var last = artifacts.slice(-1)[0];
                var rest = artifacts.slice(0, -1);
                rc.log('undeploy : ' + last.name);
                war.undeploy(deploydb.config().data[0], last).then(function (name) {
                    rc.log('undeployed : ' + name);
                    recursiveUndeploy(rest);
                }, function (err) {
                    console.error(err);
                    rc.error('error in undeploying');
                    rc.error('error', err);
                    recursiveUndeploy(rest);
                });

            } catch (err) {
                console.error(err);
                if (err.stack) {
                    console.error(err.stack);
                }
                rc.error('Exception in deployement');
                rc.error(JSON.stringify(err));
                rc.end();
            }
        };
        recursiveUndeploy(data);
    });

    io.on('deploy', function (data) {

            var errorLogger = function (msg) {
                return function (err) {
                    rc.error(msg);
                    rc.error(err);
                    rc.end();
                };
            };
            var configuration = deploydb.config().data[0];
            var launch_inner = function (array) {
                if (!array || array.length === 0) {
                    rc.end();
                    return;
                }
                var o = array.shift();
                rc.log('managing old version :' + o.name);
                war.managedOld(o).then(
                    function () {
                        rc.log('prepare download :' + o.name);
                        war.download(o).then(
                            function (name) {
                                rc.log('deploy : ' + name);
                                war.undeploy(deploydb.config().data[0], o).then(function () {
                                    rc.log('Undeployed : ' + name);

                                    war.deploy(configuration, o).then(
                                        function (name) {
                                            rc.log('Updated : ' + name);
                                            launch_inner(array);
                                        }, errorLogger('error in deploying'));
                                }, errorLogger('error in undeploying'));
                            }, errorLogger('error in downloading'));

                    }, errorLogger('error in managing old war'));

            };
            war.makedirectory().then(function () {
                rc.log('root directory : OK.');
                launch_inner(data);
            });
        }
    );
};

