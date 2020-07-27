const pProps = require('golgoth/lib/pProps');
const api = require('./helpers/api.js');
module.exports = {
  /**
   * Set several environment variables at once
   * @param {object} variables Variables to set
   **/
  async run(variables) {
    await pProps(variables, async (value, name) => {
      value ? await this.set(name, value) : await this.unset(name);
    });
  },
  /**
   * Set an environment variable on CircleCI
   * @param {string} name Name of the key
   * @param {string} value Value of the key
   **/
  async set(name, value) {
    await this.api.unsetEnvironmentVariable(name);
    await this.api.setEnvironmentVariable(name, value);
  },
  /**
   * Unset an environment variable on CircleCI
   * @param {string} name Name of the key
   **/
  async unset(name) {
    await this.api.unsetEnvironmentVariable(name);
  },
  api,
};
