export const HOME = {
  /**
   * @return {string}
   */
  CST() {
    return '/';
  },
  path() {
    return this.CST();
  }
};

export const HOME_TABS = {
  root: '/home/',
  /**
   * @return {string}
   */
  CST() {
    return `${this.root}:tab`;
  },
  path(tab) {
    return `${this.root}${tab}`
  }
};

export const ADD_ARTIFACT = {
  /**
   * @return {string}
   */
  CST() {
    return '/artifact/add';
  },
  path() {
    return this.CST();
  }
};

export const EDIT_ARTIFACT = {
  root: '/artifact/edit/',
  /**
   * @return {string}
   */
  CST() {
    return `${this.root}:loki`;
  },
  path(id) {
    return `${this.root}${id}`
  }
};

export const ADD_SERVER = {
  /**
   * @return {string}
   */
  CST() {
    return '/server/add';
  },
  path() {
    return this.CST();
  }
};

export const EDIT_SERVER = {
  root: '/server/edit/',
  /**
   * @return {string}
   */
  CST() {
    return `${this.root}:loki`;
  },
  path(id) {
    return `${this.root}${id}`
  }
};

export const ADD_SCHEDULER = {
  root: '/scheduler/',
  /**
   * @return {string}
   */
  CST() {
    return `${this.root}:type`;
  },
  path(type) {
    return `${this.root}${type}`;
  }
};
