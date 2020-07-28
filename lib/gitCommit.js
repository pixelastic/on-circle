const config = require('./config.js');
const consoleInfo = require('firost/lib/consoleInfo');
const envvars = require('./helpers/envvars.js');
const gitHelper = require('./helpers/git.js');
const firostError = require('firost/lib/error');
module.exports = {
  async run() {
    await this.sanityCheck();

    if (await this.isAlreadyConfigured()) {
      this.__consoleInfo('Project already configured for git commit');
      return true;
    }

    const gitName = await gitHelper.getConfig('user.name');
    const gitEmail = await gitHelper.getConfig('user.email');
    await envvars.setAll({
      GIT_USER_NAME: gitName,
      GIT_USER_EMAIL: gitEmail,
    });
  },
  /**
   * Git is already configured for commit if both GIT_USER_NAME and
   * GIT_USER_EMAIL are saved as environment variables
   * @returns {boolean} True if both variables are set
   **/
  async isAlreadyConfigured() {
    const hasGitName = await envvars.isSet('GIT_USER_NAME');
    const hasGitEmail = await envvars.isSet('GIT_USER_EMAIL');
    return hasGitName && hasGitEmail;
  },
  /**
   * Check that we have all the required configuration before running
   * CIRCLECI_TOKEN is required
   **/
  async sanityCheck() {
    if (!config.hasCircleCiToken()) {
      throw firostError('ERROR_CIRCLECI_NO_TOKEN', 'No CIRCLECI_TOKEN found.');
    }
  },
  __consoleInfo: consoleInfo,
};
