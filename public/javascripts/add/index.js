module.exports = function (change) {
    var Q = require('q'),
        deferred = Q.defer();
    Ractive.load('components/add/index.html').then(function (Add) {

        var add = new Add({
            el: '#content',
            data: {validate: false, file: {name: '', url: ''}}
        });
        add.on('submit', function () {
            add.set('validate', true);
            var newFile = add.get().file;
            if (newFile.url.length < 2 || newFile.name.length < 2) {
                return false;
            }

            var r = new XMLHttpRequest();
            r.open("POST", "api/artifact", true);
            r.onreadystatechange = function () {
                if (r.readyState === 4)
                    if (r.status != 200) {
                        console.error(r);
                    }
                    else {
                        change('home');
                    }

            };
            r.setRequestHeader('CONTENT-TYPE', 'application/json');
            r.send(JSON.stringify(newFile));
            change('home');
            return true;
        });

        deferred.resolve(add);
    }).catch(function (e) {
        deferred.reject(e);

    });

    return deferred.promise;
};