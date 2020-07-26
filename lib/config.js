const _ = require('golgoth/lib/lodash');

module.exports = {
  __config: {},
  get(key) {
    return _.get(this.__config, key);
  },
  set(key, value) {
    return _.set(this.__config, key, value);
  },
  setAll(options) {
    _.each(options, (value, key) => {
      this.set(key, value);
    });
  },
};
