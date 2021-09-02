const consoleInfo = require('firost/consoleInfo');
const firostError = require('firost/error');
const circleCiHelper = require('./helpers/circleci.js');
const _ = require('golgoth/lodash');
const repo = require('./helpers/repo');

module.exports = {
  /**
   * Attempt to add the current project on CircleCI
   * @returns {boolean} True on success
   **/
  async run() {
    await this.sanityCheck();

    if (await this.isAlreadyAdded()) {
      const repoSlug = await this.repo.githubRepoSlug();
      const projectUrl = `https://app.circleci.com/pipelines/github/${repoSlug}`;
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
      const repoSlug = await this.repo.githubRepoSlug();
      const addUrl = `https://app.circleci.com/projects/project-setup/github/${repoSlug}`;
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
    const username = await this.repo.githubRepoOwner();
    const reponame = await this.repo.githubRepoName();
    const thisProject = _.find(allProjects, { username, reponame });
    return !!thisProject;
  },
  __consoleInfo: consoleInfo,
  repo,
};
