const gitHubHelper = require('./helpers/github.js');
const circleCiHelper = require('./helpers/circleci.js');
const firostError = require('firost/lib/error');
const consoleInfo = require('firost/lib/consoleInfo');
module.exports = {
  /**
   * Save the GITHUB_TOKEN as env variable on CircleCI
   * @returns {boolean} True if already enabled
   **/
  async run() {
    await this.sanityCheck();

    if (await this.isAlreadyConfigured()) {
      this.__consoleInfo(
        'Project already configured for creating issues on GitHub'
      );
      return true;
    }

    const githubToken = gitHubHelper.token();
    await circleCiHelper.setEnvironmentVariable('GITHUB_TOKEN', githubToken);
  },
  /**
   * Check if the GITHUB_TOKEN is saved as env variable on CircleCI
   * @returns {boolean} True if already set
   **/
  async isAlreadyConfigured() {
    return await circleCiHelper.isSetEnvironmentVariable('GITHUB_TOKEN');
  },
  /**
   * Stop if either GITHUB_TOKEN or CIRLCECI_TOKEN is missin locally
   **/
  async sanityCheck() {
    if (!gitHubHelper.hasToken()) {
      throw firostError('ERROR_GITHUB_NO_TOKEN', 'No GITHUB_TOKEN found.');
    }
    if (!circleCiHelper.hasToken()) {
      throw firostError('ERROR_CIRCLECI_NO_TOKEN', 'No CIRCLECI_TOKEN found.');
    }
  },
  __consoleInfo: consoleInfo,
};
