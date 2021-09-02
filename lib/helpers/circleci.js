const { got, _, pProps } = require('golgoth');
const envHelper = require('./env.js');
const repo = require('./repo.js');

module.exports = {
  /**
   * Returns the CircleCi token
   * @returns {string} CircleCi Token
   **/
  token() {
    return envHelper.get('CIRCLECI_TOKEN');
  },
  /**
   * Check if a CircleCi token is configured
   * @returns {boolean} True if a token is found
   **/
  hasToken() {
    return !!this.token();
  },
  /**
   * Make a call to the CircleCI v1 API
   * @param {string} urlPath Part of the url after the /api/v1.1/
   * @param {object} userGotOptions Options to pass to the got call
   * @returns {object} Object returned by the API
   **/
  async call(urlPath, userGotOptions = {}) {
    const token = this.token();
    const apiUrl = `https://circleci.com/api/v1.1/${urlPath}?circle-token=${token}`;
    const defaultGotOptions = {
      responseType: 'json',
    };
    const gotOptions = _.merge({}, defaultGotOptions, userGotOptions);
    const response = await this.__got(apiUrl, gotOptions);
    return response.body;
  },
  /**
   * Returns the list of all projects
   * @returns {Array} List of all projects
   **/
  async listProjects() {
    return await this.call('projects');
  },
  /**
   * Add a specific project
   **/
  async add() {
    const projectSlug = await this.repo.githubRepoSlug();
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
    await this.unsetEnvironmentVariable(name);

    const projectSlug = await this.repo.githubRepoSlug();
    await this.call(`project/github/${projectSlug}/envvar`, {
      method: 'post',
      json: {
        name,
        value,
      },
    });
  },
  /**
   * Set several environment variables at once
   * @param {object} variables Variables to set
   **/
  async setEnvironmentVariables(variables) {
    await pProps(variables, async (value, name) => {
      value
        ? await this.setEnvironmentVariable(name, value)
        : await this.unsetEnvironmentVariable(name);
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
      const projectSlug = await this.repo.githubRepoSlug();
      await this.call(`project/github/${projectSlug}/envvar/${name}`, {
        method: 'delete',
      });
    } catch (err) {
      // Ignoring the error, as it errors when the ENV variable does not exist
    }
  },
  /**
   * Check if an environment variable is set
   * @param {string} name Name of the key
   * @returns {boolean} True if the env var is defined
   **/
  async isSetEnvironmentVariable(name) {
    try {
      const projectSlug = await this.repo.githubRepoSlug();
      await this.call(`project/github/${projectSlug}/envvar/${name}`);
      return true;
    } catch (_err) {
      return false;
    }
  },
  async addPrivateKey(key) {
    const projectSlug = await this.repo.githubRepoSlug();
    await this.call(`project/github/${projectSlug}/ssh-key`, {
      method: 'post',
      json: {
        hostname: 'github.com',
        private_key: key,
      },
    });
  },
  __got: got,
  repo,
};
