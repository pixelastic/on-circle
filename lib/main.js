const env = require('./env.js');
const git = require('./git.js');
const github = require('./github.js');
const consoleError = require('firost/lib/consoleError');
const consoleSuccess = require('firost/lib/consoleSuccess');
module.exports = {
  async run(callback) {
    const isCircleCi = env.get('CIRCLECI');
    if (!isCircleCi) {
      consoleError('Not running on CircleCI');
      return;
    }

    try {
      callback({
        gitChangedFiles: git.changedFiles,
        gitCommitAll: git.commitAll,
        gitPush: git.push,
        success: this.success,
        failure: this.failure,
      });
    } catch (error) {
      await github.createIssue(error);
      this.failure();
    }
  },
  success(message) {
    if (message) {
      consoleSuccess(message);
    }
    process.exit(0); // eslint-disable-line no-process-exit
  },
  failure(message) {
    if (message) {
      consoleError(message);
    }
    process.exit(1); // eslint-disable-line no-process-exit
  },
};
