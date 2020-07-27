// const env = require('./env.js');
// const git = require('./git.js');
// const config = require('./config.js');
// const dedent = require('dedent');
// const consoleError = require('firost/lib/consoleError');
// const consoleSuccess = require('firost/lib/consoleSuccess');
const follow = require('./follow.js');

module.exports = {
  follow: follow.run.bin(follow),

//   /**
//    * Check if the code is running on CircleCI
//    * @returns {boolean} True if on CircleCi, false otherwise
//    **/
//   isCircleCi() {
//     return env.get('CIRCLECI');
//   },
//   /**
//    * Run the specified code on CircleCI only. Create an issue for any error, and
//    * exit with the correct exit code
//    * @param {Function} callback Method to call on CircleCi
//    * @param {object} options Option object
//    * @param {string} options.gitName Name of the git committer
//    * @param {string} options.gitEmail Email of the git committer
//    * @param {boolean} options.createIssueOnError Set to true to create an issue
//    * on GitHub if the script fails
//    **/
//   async run(callback, options = {}) {
//     if (!this.isCircleCi()) {
//       this.__consoleError('Not running on CircleCI');
//       return;
//     }

//     // Init all config options and stop if invalid
//     config.setAll(options);
//     this.sanityCheck();

//     // Run the method and finish the build accordingly
//     try {
//       const success = await callback({
//         gitChangedFiles: git.changedFiles.bind(git),
//         gitCommitAll: git.commitAll.bind(git),
//         gitPush: git.push.bind(git),
//         success: this.success.bind(this),
//         failure: this.failure.bind(this),
//       });

//       if (success === false) {
//         this.failure('User script returned false');
//         return;
//       }
//       this.success('User script finished without error');
//     } catch (error) {
//       if (config.get('createIssueOnError')) {
//         await this.createIssue(error);
//       }
//       this.failure();
//     }
//   },
//   /**
//    * Mark the build as a success
//    * @param {string} message Optional message to display
//    **/
//   success(message) {
//     if (message) {
//       this.__consoleSuccess(message);
//     }
//     process.exit(0); // eslint-disable-line no-process-exit
//   },
//   /**
//    * Mark the build as a failure
//    * @param {string} message Optional message to display
//    **/
//   failure(message) {
//     if (message) {
//       this.__consoleError(message);
//     }
//     process.exit(1); // eslint-disable-line no-process-exit
//   },
//   /**
//    * Create an issue on GitHub
//    * @param {Error} error Caught error to use in the issue
//    **/
//   async createIssue(error) {
//     await git.createIssue(error);
//   },
//   /**
//    * Check all configuration prior to running anything, so we can catch any
//    * initialization error, like missing environment variables
//    * Will fail the build if:
//    *  - createIssueOnError is set to true, but no GITHUB_TOKEN is defined
//    **/
//   sanityCheck() {
//     const createIssueOnError = config.get('createIssueOnError');
//     const githubToken = env.get('GITHUB_TOKEN');
//     const { user, repo } = git.repoData();
//     if (createIssueOnError && !githubToken) {
//       const circleCiUrl = `https://app.circleci.com/settings/project/github/${user}/${repo}/environment-variables`;
//       const errorMessage = dedent`
//         No GITHUB_TOKEN variable found. 
//         This is required when createIssueOnError is set to true
        
//         Please create a new token with repo rights on https://github.com/settings/tokens/new
//         Then add it to ${circleCiUrl} as GITHUB_TOKEN and try again
//         `;
//       this.failure(errorMessage);
//     }
//   },
//   __consoleError: consoleError,
//   __consoleSuccess: consoleSuccess,
};
