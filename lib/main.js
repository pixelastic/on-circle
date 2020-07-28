const follow = require('./follow.js');
const circleCiHelper = require('./helpers/circleci.js');
const gitCommit = require('./gitCommit.js');
const gitPush = require('./gitPush.js');
const gitIssue = require('./gitIssue.js');

module.exports = {
  follow: follow.run.bind(follow),
  setEnvironmentVariables: circleCiHelper.setEnvironmentVariables.bind(follow),
  configureGitCommit: gitCommit.run.bind(gitCommit),
  configureGitPush: gitPush.run.bind(gitPush),
  configureGitIssue: gitIssue.run.bind(gitIssue),
};
