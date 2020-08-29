const gitHubHelper = require('./helpers/github.js');
const circleCiHelper = require('./helpers/circleci.js');
const firostError = require('firost/error');
const consoleInfo = require('firost/consoleInfo');
const consoleSuccess = require('firost/consoleSuccess');
module.exports = {
  /**
   * Save the GITHUB_TOKEN as env variable on CircleCI
   * @returns {boolean} True if already enabled
   **/
  async run() {
    await this.sanityCheck();

    if (await this.isAlreadyConfigured()) {
      this.consoleInfo(
        'Project already configured for creating issues on GitHub'
      );
      return true;
    }

    const githubToken = gitHubHelper.token();
    await circleCiHelper.setEnvironmentVariable('GITHUB_TOKEN', githubToken);
    this.consoleSuccess('Project can now create issues on GitHub');
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
  consoleInfo,
  consoleSuccess,
};
