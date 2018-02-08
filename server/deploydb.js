const Rx = require('rxjs/Rx');
const fileCollection = 'files';
const configCollection = 'configuration';
const nexusCollection = 'nexus';
const historyCollection = 'history';
const schedulerCollection = 'scheduler';
const loki = require('lokijs');

let instance = null;

class DeployDB {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.db = new loki('db/data.json', {autoload: false});
  }

  createIfNotExist(name) {
    console.log(`createIfNotExist : ${name}`);
    if (!this.db.getCollection(name)) {
      this.db.addCollection(name);
      this.db.saveDatabase();
    }
  }

  init() {
    return Rx.Observable.create((sub) => {
      this.db.loadDatabase({}, () => {
        this.createIfNotExist(fileCollection);
        this.createIfNotExist(configCollection);
        this.createIfNotExist(nexusCollection);
        this.createIfNotExist(historyCollection);
        this.createIfNotExist(schedulerCollection);
        sub.next(this.db);
        sub.complete();
      });
    });
  }

  files() {
    return this.db.getCollection(fileCollection);
  }

  schedulers() {
    return this.db.getCollection(schedulerCollection) || {data: []};
  }

  config() {
    return this.db.getCollection(configCollection);
  }

  nexus() {
    return this.db.getCollection(nexusCollection);
  }

  history() {
    return this.db.getCollection(historyCollection);
  }

  insert(collection, item) {
    collection.insert(item);
    this.db.saveDatabase();
  }

  save(collection, item) {
    if (item.$loki) {
      collection.update(item);
    } else {
      collection.insert(item);
    }
    this.db.saveDatabase();
  }

  updateStatus(collection, item, state, host) {
    if (item.$loki) {
      const filter = collection.data.filter((i) => i.$loki === item.$loki);
      if (filter && filter.length > 0) {
        const selected = filter[0];
        selected.deployStates = selected.deployStates || {};
        selected.deployStates[host] = {
          state, dt: new Date()
        };
        collection.update(selected);
        this.db.saveDatabase();
        return selected;
      }
    }
    return item;
  }

  remove(collection, item) {
    collection.remove(item);
    this.db.saveDatabase();
  }

  close() {
    this.db.close();
  }

}

module.exports = new DeployDB();
