const _ = require('golgoth/lib/lodash');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const parseGithubRepoUrl = require('parse-github-repo-url');

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
  /**
   * Return an ENV var value
   * @param {string} key ENV var key
   * @returns {string} ENV var value
   **/
  env(key) {
    return _.get(process, `env.${key}`);
  },
  /**
   * Returns the CircleCi token
   * @returns {string} CircleCi Token
   **/
  circleCiToken() {
    return this.env('CIRCLECI_TOKEN');
  },
  /**
   * Check if a CircleCi token is configured
   * @returns {boolean} True if a token is found
   **/
  hasCircleCiToken() {
    return !!this.circleCiToken();
  },
  /**
   * Returns repository information
   * @returns {object} Information object with the following keys
   *  - {string} .user GitHub username
   *  - {string} .repo GitHub reponame
   *  - {string} .branch Current branch
   **/
  async repoData() {
    if (!this.__repoData) {
      const originUrl = await gitRemoteOriginUrl();
      const [user, repo] = parseGithubRepoUrl(originUrl);
      this.__repoData = { user, repo };
    }
    return this.__repoData;
  },
  __repoData: null,
  /**
   * Returns the project slug, in the form of a user/repo string
   * @returns {string} Project slug
   **/
  async projectSlug() {
    const { user, repo } = await this.repoData();
    return `${user}/${repo}`;
  },
};
