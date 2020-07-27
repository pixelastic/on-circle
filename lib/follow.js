const consoleInfo = require('firost/lib/consoleInfo');
const firostError = require('firost/lib/error');
const config = require('./config.js');
const api = require('./helpers/api.js');
const _ = require('golgoth/lib/lodash');

module.exports = {
  /**
   * Attempt to follow the current project on CircleCI
   * @returns {boolean} True on success
   **/
  async run() {
    const { user, repo } = await config.repoData();
    await this.sanityCheck();

    if (await this.isAlreadyFollowed()) {
      const projectUrl = `https://app.circleci.com/pipelines/github/${user}/${repo}`;
      this.__consoleInfo(`Project already followed on CircleCI: ${projectUrl}`);
      return true;
    }

    await this.api.follow();
  },
  /**
   * Check that we have all the required configuration before running
   * CIRCLECI_TOKEN is required
   **/
  async sanityCheck() {
    if (!config.hasCircleCiToken()) {
      const { user, repo } = await config.repoData();
      const followUrl = `https://app.circleci.com/projects/project-setup/github/${user}/${repo}`;
      throw firostError(
        'ERROR_CIRCLECI_NO_TOKEN',
        `No CIRCLECI_TOKEN found, please visit ${followUrl} to enable manually.`
      );
    }
  },
  /**
   * Check if the project is already followed
   * Note:
   * There is no endpoint to check if a project is followed or not, so we get
   * the list of all followed projects and check if the current one is in it
   * @returns {boolean} True if already enabled, false otherwise
   **/
  async isAlreadyFollowed() {
    const allProjects = await this.api.listProjects();
    const { user, repo } = await config.repoData();
    const thisProject = _.find(allProjects, { username: user, reponame: repo });
    return !!thisProject;
  },
  __consoleInfo: consoleInfo,
  api,
};
