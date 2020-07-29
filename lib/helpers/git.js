const run = require('firost/lib/run');
const _ = require('golgoth/lib/lodash');
const firostError = require('firost/lib/error');
const gitRemoteOriginUrl = require('git-remote-origin-url');
const parseGithubRepoUrl = require('parse-github-repo-url');
const envHelper = require('./env.js');

module.exports = {
  /**
   * Run a git command in the repo
   * @param {string} gitCommand Git command to run
   * @returns {string} Command output
   */
  async run(gitCommand) {
    const { root } = await this.repoData();
    const result = await run(`cd ${root} && ${gitCommand}`, {
      shell: true,
      stdout: false,
    });
    return result.stdout;
  },
  /**
   * Return a git config value
   * @param {string} name Name of the config to get
   * @returns {string|boolean} Value of the config, or false if not found
   **/
  async getConfig(name) {
    try {
      return await this.run(`git config ${name}`);
    } catch (_err) {
      return false;
    }
  },
  /**
   * Set a git config value only if wasn't set before
   * @param {string} name Name of the config
   * @param {string} value Value of the config
   **/
  async setConfig(name, value) {
    await this.run(`git config ${name} ${value}`);
  },
  /**
   * Returns repository information
   * @returns {object} Information object with the following keys
   *  - {string} .user GitHub username
   *  - {string} .repo GitHub reponame
   *  - {string} .branch Current branch
   **/
  async repoData() {
    if (!this.__repoData) {
      const originUrl = await gitRemoteOriginUrl();
      const [user, repo] = parseGithubRepoUrl(originUrl);
      const root = process.cwd();
      const branch = envHelper.get('CIRCLE_BRANCH');
      this.__repoData = { user, repo, root, branch };
    }
    return this.__repoData;
  },
  __repoData: null,

  /**
   * Configure git with a name and email
   * Values are either passed as arguments or read from ENV variabmes
   **/
  async preRun() {
    if (this.isConfigured) {
      return;
    }
    const email = this.config('gitEmail') || envHelper.get('GIT_USER_EMAIL');
    const name = this.config('gitName') || envHelper.get('GIT_USER_NAME');
    if (!email) {
      throw firostError('GIT_ERROR_NO_EMAIL', 'No git email configured');
    }
    if (!name) {
      throw firostError('GIT_ERROR_NO_NAME', 'No git name configured');
    }

    await this.setConfig('user.email', email);
    await this.setConfig('user.name', name);
    this.isConfigured = true;
  },
  isConfigured: false,
  /**
   * Returns the list of changed files in git status
   * @returns {Array} List of changed files
   **/
  async changedFiles() {
    await this.preRun();
    const porcelain = await this.run('git status --porcelain', {
      stdout: false,
    });
    return _.chain(porcelain)
      .split('\n')
      .map((line) => {
        return _.chain(line).split(' ').last().value();
      })
      .compact()
      .value();
  },
  /**
   * Commit all changed files, with specified commit message
   * @param {string} commitMessage Commit message to add
   **/
  async commitAll(commitMessage) {
    await this.preRun();

    await this.run('git add --all .');
    await this.run(
      `git commit --no-verify --message "${commitMessage}" --message "[skip ci]"`,
      { shell: true }
    );
  },
  /**
   * Push the repository to origin
   **/
  async push() {
    await this.preRun();
    const { branch } = await this.repoData();
    const command = `git push --set-upstream origin ${branch}`;
    await this.run(command);
  },
};
