const { Octokit } = require('@octokit/rest');
const env = require('./env.js');
module.exports = {
  username: env.get('CIRCLE_PROJECT_USERNAME'),
  reponame: env.get('CIRCLE_PROJECT_REPONAME'),
  octokit: new Octokit({ auth: env.get('GITHUB_TOKEN') }),
  /**
   * Create an issue with the build error
   * @param {object} err Error object
   **/
  async createIssue(err) {
    const errorDetails = err.toString();
    const owner = env.get('CIRCLE_PROJECT_USERNAME');
    const repo = env.get('CIRCLE_PROJECT_REPONAME');
    const buildUrl = env.get('CIRCLE_BUILD_URL');

    await this.octokit.issues.create({
      owner,
      repo,
      title: 'CircleCI build error',
      body: [
        'A CircleCI build has failed with the following error:',
        '```',
        errorDetails,
        '```',
        `More details on ${buildUrl}`,
      ].join('\n'),
    });
  },
};
