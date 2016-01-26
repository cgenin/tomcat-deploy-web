module.exports = function () {
    var Q = require('q'),
        deferred = Q.defer();
    try {
        $.get('api/all', function (all) {
            console.log(all)
            var items = all.items,
                checked = [],
                configuration = all.server || {
                        user: {},
                        hostname: ''
                    };

            if (items && items.length > 0) {
                items.forEach(function () {
                    checked.push(false);
                });
            }
            require('./logger')().then(function (Logger) {
                require('./message')().then(function (Message) {
                    Ractive.load('components/home/index.html').then(function (Home) {
                            var home = new Home({
                                    el: '#content',
                                    data: {
                                        all: false,
                                        checked: checked,
                                        items: items,
                                        enabledButt: false,
                                        targetDir: '',
                                        configuration: configuration,
                                        message: {}
                                    },
                                    components: {
                                        Logger: Logger.component,
                                        Message: Message
                                    },
                                    onDelete: function (item) {
                                        var r = new XMLHttpRequest();
                                        r.open("DELETE", "api/artifact", true);
                                        r.onreadystatechange = function () {
                                            if (r.readyState === 4)
                                                if (r.status != 200) {
                                                    console.error(r);
                                                    return;
                                                }
                                                else {
                                                    var i = items.indexOf(item);
                                                    if (i != -1) {
                                                        items.splice(i, 1);
                                                    }
                                                    success('Item deleted !!!', 5000);
                                                }

                                        };
                                        r.setRequestHeader('CONTENT-TYPE', 'application/json');
                                        r.send(JSON.stringify(item));
                                        return false;
                                    }
                                }),
                                success = function (msg, delay) {
                                    console.log(msg)
                                    home.findComponent('Message').fire('message-success', msg, delay);
                                };

                            var toIndex = function () {
                                var b = home.get('checked');
                                return b.map(function (c, i) {
                                    if (c) {
                                        return i;
                                    }
                                    return -1;
                                }).filter(function (v) {
                                    return v > -1;
                                });
                            };
                            var selectedFiles = function () {
                                var indexes = toIndex(),
                                    items = home.get('items');
                                return items.map(function (o, i) {
                                    if (indexes.indexOf(i) !== -1) {
                                        return o;
                                    }
                                    return -1;
                                }).filter(function (v) {
                                    return v !== -1;
                                });
                            };

                            home.on('complete', function () {
                                $('[data-toggle="tooltip"]').tooltip();
                            });
                            home.observe('checked configuration', function () {
                                var user = home.get('configuration.user'),
                                    hostname = home.get('configuration.hostname'),
                                    enable = toIndex().length > 0 && user && user.name && user.password && hostname && hostname.length > 0;
                                home.set('enabledButt', enable);
                            });
                            home.on('all-checked', function () {
                                var all = !home.get('all');
                                var checked = [];
                                if (items && items.length > 0) {
                                    items.forEach(function () {
                                        checked.push(all);
                                    });
                                }
                                home.set({all: all, checked: checked});
                            });

                            home.on('save', function () {
                                /*
                                 deploydb.save(config, configuration);
                                 success('Configuration saved !!!', 5000);*/
                                var configuration = home.get('configuration');
                                var r = new XMLHttpRequest();
                                r.open("PUT", "api/server", true);
                                r.onreadystatechange = function () {
                                    if (r.readyState === 4)
                                        if (r.status != 200) {
                                            console.error(r);
                                            return;
                                        }
                                        else {
                                            success('Configuration saved !!!', 5000);
                                        }

                                };
                                r.setRequestHeader('CONTENT-TYPE', 'application/json');
                                r.send(JSON.stringify(configuration));
                            });


                            home.on('submit', function () {
                                /*   try {
                                 console.log('submit');
                                 $('.nav-tabs a[href="#logs"]').tab('show');

                                 Logger.start();
                                 Logger.log('start deploy...');
                                 var war = require('../war'),
                                 configuration = home.get('configuration'),
                                 selected = selectedFiles();

                                 var nbDeploiement = selected.length,
                                 endMessage = function () {
                                 nbDeploiement--;
                                 if (0 === nbDeploiement) {
                                 Logger.log("********************** END **********************");
                                 }
                                 },
                                 errorLogger = function (msg) {
                                 return function (err) {
                                 Logger.error(msg);
                                 Logger.error(err);
                                 endMessage();
                                 };
                                 };

                                 Logger.log('selected wars :' + selected.length);

                                 var launch_inner = function (array) {
                                 if (!array || array.length === 0) {
                                 return;
                                 }
                                 var o = array.shift();
                                 Logger.log('managing old version :' + o.name);
                                 war.managedOld(o).then(
                                 function () {
                                 Logger.log('prepare download :' + o.name);
                                 war.download(o).then(
                                 function (name) {
                                 Logger.log('deploy : ' + name);
                                 war.undeploy(configuration, o).then(function () {
                                 Logger.log('Undeployed : ' + name);
                                 war.deploy(configuration, o).then(
                                 function (name) {
                                 Logger.log('Updated : ' + name);
                                 launch_inner(array);
                                 endMessage();
                                 }, errorLogger('error in deploying'));
                                 }, errorLogger('error in undeploying'));
                                 }, errorLogger('error in downloading'));

                                 }, errorLogger('error in managing old war'));

                                 };


                                 war.makedirectory().then(
                                 function () {
                                 Logger.log('root directory : OK.');
                                 launch_inner(selected);
                                 });
                                 }
                                 catch (e) {
                                 Logger.error(e);
                                 }*/
                                return false;
                            });
                            home.on('undeploy', function () {
                                try {
                                    $('.nav-tabs a[href="#logs"]').tab('show');
                                    Logger.start();
                                    var war = require('../war'),
                                        configuration = home.get('configuration'),
                                        selected = selectedFiles();

                                    var nbDeploiement = 0,
                                        endMessage = function () {
                                            nbDeploiement += 1;
                                            if (selected.length === nbDeploiement) {
                                                Logger.log("********************** END **********************");
                                            }
                                        },
                                        errorLogger = function (msg) {
                                            return function (err) {
                                                Logger.error(msg);
                                                Logger.error(err);
                                                endMessage();
                                            };
                                        };

                                    Logger.log('selected wars :' + selected.length);
                                    var source = new EventSource('api/deploy');
                                    source.onmessage = function(event) {
                                        document.getElementById("result").innerHTML += event.data + "<br>";
                                    };
                                    /*
                                    selected.forEach(function (o) {
                                        Logger.log('deploy : ' + o.name);
                                        war.undeploy(configuration, o).then(function (name) {
                                            Logger.log('undeployed : ' + name);
                                            endMessage();
                                        }, errorLogger('error in undeploying'));
                                    });*/

                                } catch (e) {
                                    Logger.error(e);
                                }

                                return false;
                            });
                            deferred.resolve(home);
                        }
                    ).catch(function (e) {
                        deferred.reject(e);
                    });
                });
            });
        });
    }
    catch
        (e) {
        deferred.reject(e);
    }

    return deferred.promise;
};