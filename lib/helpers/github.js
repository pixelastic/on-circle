const { Octokit } = require('@octokit/rest');
const envHelper = require('./env.js');
const gitHelper = require('./git.js');

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
  /**
   * Create an issue with the build error
   * @param {object} err Error object
   **/
  async createIssue(err) {
    const { user, repo } = this.repoData();
    const errorDetails = err.toString();

    const buildUrl = envHelper.get('CIRCLE_BUILD_URL');

    await this.octokit().issues.create({
      owner: user,
      repo,
      title: 'CircleCI build error',
      body: [
        'A CircleCI build has failed with the following error:',
        '```',
        errorDetails,
        '```',
        `More details on ${buildUrl}`,
      ].join('\n'),
    });
  },
  async addPublicKey(key) {
    const { user, repo } = await gitHelper.repoData();
    const title = 'CircleCI - Push to repo';

    await this.octokit().repos.createDeployKey({
      owner: user,
      repo,
      title,
      key,
      read_only: false,
    });
  },
  octokit() {
    if (!this.__octokit) {
      const githubToken = envHelper.get('GITHUB_TOKEN');
      this.__octokit = new Octokit({ auth: githubToken });
    }
    return this.__octokit;
  },
  __octokit: null,
};
