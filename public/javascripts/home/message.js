module.exports = function () {
    var Q = require('q'),
        deferred = Q.defer();
    try {

        var item = {show: false, text: '', type: ''};
        $.get('/components/home/message.html', function (messageTemplate) {

            deferred.resolve(Ractive.extend({
                isolated: false,
                template: messageTemplate,
                data: function () {
                    return item;
                },
                visible: function (msg, type, delay) {
                    var self = this;
                    self.set({content: msg, show: true, type: type});
                    setTimeout(function () {
                        self.set({show: false});
                    }, delay);
                }, success: function (msg, delay) {
                    var type = 'success';
                    this.visible(msg, type, delay);

                },
                onrender: function () {
                    this.on('message-success', function (msg, delay) {
                        this.success(msg, delay);
                    });
                }
            }));
        });
    }
    catch (e) {
        console.error(e);
        deferred.reject(e);
    }
    return deferred.promise;
};
