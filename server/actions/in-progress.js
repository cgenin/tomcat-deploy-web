let instance = null;

class InProgress {
  constructor() {
    if (instance) {
      return instance;
    }
    instance = this;
    this.next = [];
    this.__active = false;
    this.event = 'deploiement-in-progress';
  }

  isActive() {
    return this.__active;
  }

  schedule(callback) {
    if (this.__active) {
      this.next.push(callback);
      return;
    }
    callback();
  }

  active() {
    this.__active = true;
    return true;
  }

  disable() {
    this.__active = false;
    if (this.next.length > 0) {
      const [head, ...tail] = this.next;
      this.next = tail;
      head();
    }
    return false;
  }

}

module.exports = new InProgress();
