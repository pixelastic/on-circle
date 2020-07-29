const consoleError = require('firost/lib/consoleError');
const consoleSuccess = require('firost/lib/consoleSuccess');
const envHelper = require('./helpers/env.js');
const gitHelper = require('./helpers/git.js');
const gitHubHelper = require('./helpers/github.js');
module.exports = {
  /**
   * Run the specified code on CircleCI only. Create an issue for any error, and
   * exit with the correct exit code
   * @param {Function} callback Method to call on CircleCi
   **/
  async run(callback) {
    const isCircleCi = !!envHelper.get('CIRCLECI');
    const shouldCreateIssue = !!envHelper.get('GITHUB_TOKEN');
    // Stop if not running on CircleCI
    if (!isCircleCi) {
      this.failure('Not running on CircleCI');
      return;
    }

    // Run the method in a sandbox
    try {
      const success = await callback({
        gitChangedFiles: gitHelper.changedFiles.bind(gitHelper),
        gitCommitAll: gitHelper.commitAll.bind(gitHelper),
        gitPush: gitHelper.push.bind(gitHelper),
        success: this.success.bind(this),
        failure: this.failure.bind(this),
      });

      // Fail if the method returns false explicitly
      if (success === false) {
        this.failure('User script returned false');
        return;
      }

      this.success('User script finished without error');
    } catch (error) {
      // Log issue to GitHub if possible
      if (shouldCreateIssue) {
        await gitHubHelper.createIssue(error);
      }

      this.failure();
    }
  },
  shouldCreateIssue() {
    return !!envHelper.get('GITHUB_TOKEN');
  },
  /**
   * Mark the build as a success
   * @param {string} message Optional message to display
   **/
  success(message) {
    if (message) {
      this.__consoleSuccess(message);
    }
    process.exit(0); // eslint-disable-line no-process-exit
  },
  /**
   * Mark the build as a failure
   * @param {string} message Optional message to display
   **/
  failure(message) {
    if (message) {
      this.__consoleError(message);
    }
    process.exit(1); // eslint-disable-line no-process-exit
  },
  __consoleError: consoleError,
  __consoleSuccess: consoleSuccess,
};
