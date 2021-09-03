const { Octokit } = require('@octokit/rest');
const envHelper = require('./env.js');
const _ = require('golgoth/lodash');
const repo = require('./repo.js');

module.exports = {
  /**
   * Returns the GitHub token
   * @returns {string} GitHub Token
   **/
  token() {
    return envHelper.get('GITHUB_TOKEN');
  },
  /**
   * Check if a CircleCi token is configured
   * @returns {boolean} True if a token is found
   **/
  hasToken() {
    return !!this.token();
  },
  async call(methodName, options = {}) {
    if (!this.__octokit) {
      const githubToken = envHelper.get('GITHUB_TOKEN');
      this.__octokit = new Octokit({ auth: githubToken });
    }

    const method = _.get(this.__octokit, methodName);
    const response = await method(options);
    return response.data;
  },
  __octokit: null,
  /**
   * Create an issue with the build error
   * @param {object} err Error object
   **/
  async createIssue(err) {
    const owner = await this.repo.githubRepoOwner();
    const repoName = await this.repo.githubRepoName();
    const errorDetails = err.toString();

    const buildUrl = envHelper.get('CIRCLE_BUILD_URL');

    await this.call('issues.create', {
      owner,
      repo: repoName,
      title: 'CircleCI build error',
      body: [
        'A CircleCI build has failed with the following error:',
        '```',
        errorDetails,
        '```',
        `More details on ${buildUrl}`,
        `ping @${owner}`,
      ].join('\n'),
    });
  },
  /**
   * Add the public key to GitHub
   * @param {string} key Content of the public key
   **/
  async addPublicKey(key) {
    const owner = await this.repo.githubRepoOwner();
    const repoName = await this.repo.githubRepoName();
    const title = 'CircleCI - Push to repo';

    await this.call('repos.createDeployKey', {
      owner,
      repo: repoName,
      title,
      key,
      read_only: false,
    });
  },
  repo,
};
