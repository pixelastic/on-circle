const onCircle = require('../main.js');
module.exports = async () => {
  await onCircle.configureGitCommit();
  await onCircle.configureGitPush();
  await onCircle.configureGitsIssue();
};
