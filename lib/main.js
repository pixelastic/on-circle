const run = require('./run.js');
const add = require('./add.js');
const circleCiHelper = require('./helpers/circleci.js');
const gitCommit = require('./gitCommit.js');
const gitPush = require('./gitPush.js');
const gitIssue = require('./gitIssue.js');

module.exports = {
  run: run.run.bind(run),
  add: add.run.bind(add),
  setEnvironmentVariables:
    circleCiHelper.setEnvironmentVariables.bind(circleCiHelper),
  configureGitCommit: gitCommit.run.bind(gitCommit),
  configureGitPush: gitPush.run.bind(gitPush),
  configureGitIssue: gitIssue.run.bind(gitIssue),
};
