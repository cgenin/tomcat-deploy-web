var DeployDB = function DeployDB() {
    var Q = require('q'),
        fileCollection = 'files',
        configCollection = 'configuration',
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

            createIfNotExist(fileCollection);
            createIfNotExist(configCollection);
            deferred.resolve(db);
        });
        return deferred.promise;
    };

    this.files = function () {
        return db.getCollection(fileCollection);
    };

    this.config = function () {
        return db.getCollection(configCollection);
    };
    this.insert = function (collection, item) {
        collection.insert(item);
        db.saveDatabase();
    };

    this.save = function (collection, item) {
        if(item.$loki){
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
    }
    return this.instance;
};

module.exports = DeployDB.getInstance();
