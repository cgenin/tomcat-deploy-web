(function () {
    Ractive.load('components/navigation.html').then(function (DeployBar) {
        var deploybar, current = null;
        var change = function (newNavigation) {
            var old = deploybar.get();
            for (var propertyName in old) {
                old[propertyName] = false;
            }
            old[newNavigation] = true;
            deploybar.set(old);
            if (current) {
                current.teardown();
            }
            require(newNavigation)(change).then(function (c) {
                current = c;
            }, function (error) {
                console.error(error);
            });
        };
        deploybar = new DeployBar({
            el: '#deployBar',
            data: {home: false, add: false},
            navChange: change
        });
        deploybar.on('close', function () {
            deploydb.close();
            window.close();
        });
        change('home');
    }).catch(function (e) {
        console.error(e);
    });
})();
