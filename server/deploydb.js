const DeployDB = function DeployDB() {
  const Q = require('q');
  const fileCollection = 'files';
  const configCollection = 'configuration';
  const loki = require('lokijs');
  const db = new loki('db/data.json', {autoload: true});
  const createIfNotExist = function (name) {
    console.log('createIfNotExist :' + name);
    if (!db.getCollection(name)) {
      db.addCollection(name);
      db.saveDatabase();
    }
  };

  this.init = function () {
    const deferred = Q.defer();
    db.loadDatabase({}, () => {

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
    if (item.$loki) {
      collection.update(item);
    } else {
      collection.insert(item);
    }
    db.saveDatabase();
  };

  this.updateStatus = function (collection, item, state) {
    if (item.$loki) {
      const filter = collection.data.filter((i) => {
        return i.$loki === item.$loki;
      });
      if (filter && filter.length > 0) {
        filter[0].status = {
          state: state,
          dt   : new Date()
        };
        collection.update(filter[0]);
        db.saveDatabase();
        return filter[0];
      }
    }
    return item;
  };

  this.remove = function (collection, item) {
    collection.remove(item);
    db.saveDatabase();
  };
  this.close = function () {
    db.close();
  };
  if (DeployDB.caller !== DeployDB.getInstance) {
    throw new Error('This object cannot be instanciated');
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
