module.exports = function () {
    var Q = require('q'),
        deferred = Q.defer();
    try {


        $.get('components/home/logger.html', function (mainTemplate) {
            var moment = require('moment'),
                items = [],
                logger = Ractive.extend({
                    isolated: false,
                    template: mainTemplate,
                    data: function () {
                        return {logs: items};
                    },
                    onrender: function () {
                        var self = this;
                        self.on('clear', function () {
                            items = [];
                            self.set({logs: items});
                        });
                    }
                }),

                pusLog = function (o, state) {
                    var date = new Date(),
                        body = o || 'null',
                        formattedDate = moment(date).format('YYYY/MM/DD HH:mm:ss SSSSSSSSS');
                    items.push({date: date, error: state, content: body, formattedDate: formattedDate});
                };

            deferred.resolve({
                component: logger,
                log: function (o) {
                    pusLog(o, false);
                },
                start: function () {
                    pusLog('*****************************************************************************');
                },
                error: function (o) {
                    pusLog(o, true);
                }
            });
        });
    }
    catch (e) {
        console.error(e);
        deferred.reject(e);
    }
    return deferred.promise;
};
