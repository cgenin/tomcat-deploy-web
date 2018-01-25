let instance = null;

class InProgress {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.__active = false;
    this.event = 'deploiement-in-progress';
  }

  isActive() {
    return this.__active;
  }

  active() {
    this.__active = true;
    return true;
  }

  disable() {
    this.__active = false;
    return false;
  }

}

module.exports = new InProgress();
