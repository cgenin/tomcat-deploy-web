const Rx = require('rxjs/Rx');
const loki = require('lokijs');
const logger = require('./logger');
const fileCollection = 'files';
const configCollection = 'configuration';
const nexusCollection = 'nexus';
const schedulersCollection = 'schedulers';
const historyCollection = 'history';
const toolConfigurationCollection = 'toolConfiguration';

let instance = null;

class DeployDB {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;

  }

  createIfNotExist(name) {
    logger.info(`createIfNotExist : ${name}`);
    if (!this.db.getCollection(name)) {
      this.db.addCollection(name);
      this.db.saveDatabase();
    }
  }

  init(path) {
    if (!path) {
      throw new Error('dbpath must not be undefined');
    }
    logger.info(`load db in '${path}'`);
    this.db = new loki(path, {autoload: false});
    return Rx.Observable.create((sub) => {
      this.db.loadDatabase({}, () => {
        this.createIfNotExist(fileCollection);
        this.createIfNotExist(configCollection);
        this.createIfNotExist(nexusCollection);
        this.createIfNotExist(historyCollection);
        this.createIfNotExist(schedulersCollection);
        this.createIfNotExist(toolConfigurationCollection);
        sub.next(this.db);
        sub.complete();
      });
    });
  }

  files() {
    return this.db.getCollection(fileCollection);
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

  toolConfiguration() {
    return this.db.getCollection(toolConfigurationCollection) || {data: []};
  }

  schedulers() {
    return this.db.getCollection(schedulersCollection) || {data: []};
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
