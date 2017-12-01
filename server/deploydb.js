const DeployDB = function DeployDB() {
  const Rx = require('rxjs/Rx');
  const fileCollection = 'files';
  const configCollection = 'configuration';
  const nexusCollection = 'nexus';
  const historyCollection = 'history';
  const loki = require('lokijs');
  const db = new loki('db/data.json', { autoload: false });
  const createIfNotExist = function (name) {
    console.log(`createIfNotExist : ${name}`);
    if (!db.getCollection(name)) {
      db.addCollection(name);
      db.saveDatabase();
    }
  };

  this.init = function () {
    return Rx.Observable.create((sub)=>{
      db.loadDatabase({}, () => {
        createIfNotExist(fileCollection);
        createIfNotExist(configCollection);
        createIfNotExist(nexusCollection);
        createIfNotExist(historyCollection);
        sub.next(db);
        sub.complete();
      });
    });
  };

  this.files = function () {
    return db.getCollection(fileCollection);
  };

  this.config = function () {
    return db.getCollection(configCollection);
  };

  this.nexus = function () {
    return db.getCollection(nexusCollection);
  };

  this.history = function () {
    return db.getCollection(historyCollection);
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

  this.updateStatus = function (collection, item, state, host) {
    if (item.$loki) {
      const filter = collection.data.filter((i) => i.$loki === item.$loki);
      if (filter && filter.length > 0) {
        const selected = filter[0];
        selected.deployStates = selected.deployStates || {};
        selected.deployStates[host] = {
          state, dt: new Date()
        };
        collection.update(selected);
        db.saveDatabase();
        return selected;
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
