const env = require('./env.js');
const git = require('./git.js');
const config = require('./config.js');
const github = require('./github.js');
const consoleError = require('firost/lib/consoleError');
const consoleSuccess = require('firost/lib/consoleSuccess');

module.exports = {
  /**
   * Check if the code is running on CircleCI
   * @returns {boolean} True if on CircleCi, false otherwise
   **/
  isCircleCi() {
    return env.get('CIRCLECI');
  },
  /**
   * Run the specified code on CircleCI only. Create an issue for any error, and
   * exit with the correct exit code
   * @param {Function} callback Method to call on CircleCi
   **/
  async run(callback) {
    // Stop if not running on CircleCI
    if (!this.isCircleCi()) {
      this.__consoleError('Not running on CircleCI');
      return;
    }

    // Run the method but report any error to an issue
    try {
      const success = await callback({
        gitChangedFiles: git.changedFiles.bind(git),
        gitCommitAll: git.commitAll.bind(git),
        gitPush: git.push.bind(git),
      });
      success ? this.success() : this.failure();
    } catch (error) {
      await this.createIssue(error);
      this.failure();
    }
  },
  async configure(options = {}) {
    config.setAll(options);
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
      consoleError(message);
    }
    process.exit(1); // eslint-disable-line no-process-exit
  },
  /**
   * Create an issue on GitHub
   * @param {Error} error Caught error to use in the issue
   **/
  async createIssue(error) {
    await github.createIssue(error);
  },
  __consoleError: consoleError,
  __consoleSuccess: consoleSuccess,
};
