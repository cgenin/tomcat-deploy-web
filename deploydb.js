var DeployDB = function DeployDB() {
    var Q = require('q'),
        OldVersCollection = 'old-versions',
        loki = require('lokijs'),
        db = new loki('db/data.json', {autoload: true});

    var createIfNotExist = function (name) {
        console.log('createIfNotExist :' + name);
        if (!db.getCollection(name)) {
            db.addCollection(name);
            db.saveDatabase();
        }
    };

    this.init = function () {
        var deferred = Q.defer();
        db.loadDatabase({}, function () {

            createIfNotExist(OldVersCollection);
            deferred.resolve(db);
        });
        return deferred.promise;
    };

    this.getCollection = function () {
        return db.getCollection(OldVersCollection);
    };

    this.insert = function (collection, item) {
        collection.insert(item);
        db.saveDatabase();
    };

    this.save = function (collection, item) {
        if (item.$loki) {
            collection.update(item);
        } else {
            collection.insert(item);
        }
        db.saveDatabase();
    };
    this.remove = function (collection, item) {
        collection.remove(item);
        db.saveDatabase();
    };
    this.close = function () {
        db.close();
    };
    if (DeployDB.caller != DeployDB.getInstance) {
        throw new Error("This object cannot be instanciated");
    }
};

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
DeployDB.instance = null;

/**
 * Singleton getInstance definition
 * @return DeployDB class
 */
DeployDB.getInstance = function () {
    if (this.instance === null) {
        this.instance = new DeployDB();
        this.instance.init().then(function () {
            console.log('Initializing db : OK.');
        }).catch(function (err) {
            console.error('error initializing db');
            console.error(err);
        });
    }
    return this.instance;
};

module.exports = DeployDB.getInstance();
