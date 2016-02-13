'use strict';

const InProgress = function InProgress() {
  let __active = false;
  this.isActive = function () {
    return __active;
  };
  this.active = function () {
    __active = true;
    return true;
  };
  this.disable = function () {
    __active = false;
    return false;
  };
  this.event = 'deploiement-in-progress';
};


/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
InProgress.instance = null;

/**
 * Singleton getInstance definition
 * @return DeployDB class
 */
InProgress.getInstance = function () {
  if (this.instance === null) {
    this.instance = new InProgress();
  }
  return this.instance;
};

module.exports = InProgress.getInstance();
