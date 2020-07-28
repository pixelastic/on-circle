const got = require('golgoth/lib/got');
const _ = require('golgoth/lib/lodash');
const config = require('../config.js');

module.exports = {
  /**
   * Make a call to the CircleCI v1 API
   * @param {string} urlPath Part of the url after the /api/v1.1/
   * @param {object} userGotOptions Options to pass to the got call
   * @returns {object} Object returned by the API
   **/
  async call(urlPath, userGotOptions = {}) {
    const token = config.circleCiToken();
    const apiUrl = `https://circleci.com/api/v1.1/${urlPath}?circle-token=${token}`;
    const defaultGotOptions = {
      responseType: 'json',
    };
    const gotOptions = _.merge({}, defaultGotOptions, userGotOptions);
    const response = await this.__got(apiUrl, gotOptions);
    return response.body;
  },
  /**
   * Returns the list of all followed projects
   * @returns {Array} List of all followed projects
   **/
  async listProjects() {
    return await this.call('projects');
  },
  /**
   * Follow a specific project
   **/
  async follow() {
    const projectSlug = await config.projectSlug();
    await this.call(`project/github/${projectSlug}/follow`, {
      method: 'post',
    });
  },
  /**
   * Set an environment variable
   * @param {string} name Name of the key
   * @param {string} value Value of the key
   **/
  async setEnvironmentVariable(name, value) {
    const projectSlug = await config.projectSlug();

    await this.call(`project/github/${projectSlug}/envvar`, {
      method: 'post',
      json: {
        name,
        value,
      },
    });
  },
  /**
   * Unset an environment variable
   * Note: Unsetting a variable that does not exist throw and error, so we
   * ignore that
   * @param {string} name Name of the key
   **/
  async unsetEnvironmentVariable(name) {
    try {
      const projectSlug = await config.projectSlug();
      await this.call(`project/github/${projectSlug}/envvar/${name}`, {
        method: 'delete',
      });
    } catch (err) {
      // Ignoring the error, as it errors when the ENV variable does not exist
    }
  },
  /**
   * Ceck if an environment variable is set
   * @param {string} name Name of the key
   * TODO: Test and implement
   **/
  async isSetEnvironmentVariable(name) {
    const projectSlug = await config.projectSlug();
    await this.call(`project/github/${projectSlug}/envvar/${name}`);
  },
  __got: got,
};
