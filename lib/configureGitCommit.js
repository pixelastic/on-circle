const { consoleInfo, consoleSuccess, error: firostError } = require('firost');
const circleCiHelper = require('./helpers/circleci.js');
const repo = require('./helpers/repo.js');

module.exports = {
  async run() {
    await this.sanityCheck();

    if (await this.isAlreadyConfigured()) {
      this.consoleInfo('Project already configured for git commit');
      return true;
    }

    const gitName = await this.repo.getConfig('user.name');
    const gitEmail = await this.repo.getConfig('user.email');
    await circleCiHelper.setEnvironmentVariables({
      GIT_USER_NAME: gitName,
      GIT_USER_EMAIL: gitEmail,
    });
    this.consoleSuccess('Project can now commit on the repo');
  },
  /**
   * Git is already configured for commit if both GIT_USER_NAME and
   * GIT_USER_EMAIL are saved as environment variables
   * @returns {boolean} True if both variables are set
   **/
  async isAlreadyConfigured() {
    const hasGitName = await circleCiHelper.isSetEnvironmentVariable(
      'GIT_USER_NAME'
    );
    const hasGitEmail = await circleCiHelper.isSetEnvironmentVariable(
      'GIT_USER_EMAIL'
    );
    return hasGitName && hasGitEmail;
  },
  /**
   * Check that we have all the required configuration before running
   * CIRCLECI_TOKEN is required
   **/
  async sanityCheck() {
    if (!circleCiHelper.hasToken()) {
      throw firostError('ERROR_CIRCLECI_NO_TOKEN', 'No CIRCLECI_TOKEN found.');
    }
  },
  consoleInfo,
  consoleSuccess,
  repo,
};