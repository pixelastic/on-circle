const consoleInfo = require('firost/consoleInfo');
const firostError = require('firost/error');
const gitHelper = require('./helpers/git.js');
const circleCiHelper = require('./helpers/circleci.js');
const _ = require('golgoth/lodash');

module.exports = {
  /**
   * Attempt to add the current project on CircleCI
   * @returns {boolean} True on success
   **/
  async run() {
    const { user, repo } = await gitHelper.repoData();
    await this.sanityCheck();

    if (await this.isAlreadyAdded()) {
      const projectUrl = `https://app.circleci.com/pipelines/github/${user}/${repo}`;
      this.__consoleInfo(`Project already added  on CircleCI: ${projectUrl}`);
      return true;
    }

    await circleCiHelper.add();
  },
  /**
   * Check that we have all the required configuration before running
   * CIRCLECI_TOKEN is required
   **/
  async sanityCheck() {
    if (!circleCiHelper.hasToken()) {
      const { user, repo } = await gitHelper.repoData();
      const addUrl = `https://app.circleci.com/projects/project-setup/github/${user}/${repo}`;
      throw firostError(
        'ERROR_CIRCLECI_NO_TOKEN',
        `No CIRCLECI_TOKEN found, please visit ${addUrl} to enable manually.`
      );
    }
  },
  /**
   * Check if the project is already added
   * Note:
   * There is no endpoint to check if a project is added or not, so we get
   * the list of all added projects and check if the current one is in it
   * @returns {boolean} True if already enabled, false otherwise
   **/
  async isAlreadyAdded() {
    const allProjects = await circleCiHelper.listProjects();
    const { user, repo } = await gitHelper.repoData();
    const thisProject = _.find(allProjects, { username: user, reponame: repo });
    return !!thisProject;
  },
  __consoleInfo: consoleInfo,
};
