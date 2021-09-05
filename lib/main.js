const run = require('./run.js');
const follow = require('./follow.js');
const trigger = require('./trigger.js');
const circleCiHelper = require('./helpers/circleci.js');
const configureGitCommit = require('./configureGitCommit.js');
const configureGitPush = require('./configureGitPush.js');
const configureGitIssue = require('./configureGitIssue.js');

module.exports = {
  run: run.run.bind(run),
  follow: follow.run.bind(follow),
  trigger: trigger.run.bind(trigger),
  setEnvironmentVariables:
    circleCiHelper.setEnvironmentVariables.bind(circleCiHelper),
  configureGitCommit: configureGitCommit.run.bind(configureGitCommit),
  configureGitPush: configureGitPush.run.bind(configureGitPush),
  configureGitIssue: configureGitIssue.run.bind(configureGitIssue),
};
