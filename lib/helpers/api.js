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
   * @param {string} projectSlug Project slug, in the form username/repo
   **/
  async follow(projectSlug) {
    await this.call(`project/github/${projectSlug}/follow`, {
      method: 'post',
    });
  },
  __got: got,
};
