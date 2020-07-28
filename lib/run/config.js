const _ = require('golgoth/lib/lodash');

module.exports = {
  // Private object storing the config.
  // Initialized with the default config
  __config: {
    gitName: null,
    gitEmail: null,
    createIssueOnError: false,
  },
  /**
   * Reads a config value
   * @param {string} key Config key to read
   * @returns {*} Config value
   **/
  get(key) {
    return _.get(this.__config, key);
  },
  /**
   * Set a config value
   * @param {string} key Config key to set
   * @param {*} value Config value to set
   **/
  set(key, value) {
    _.set(this.__config, key, value);
  },
  /**
   * Set several config keys at once
   * @param {object} options Object of config to set
   **/
  setAll(options) {
    _.each(options, (value, key) => {
      this.set(key, value);
    });
  },
};
