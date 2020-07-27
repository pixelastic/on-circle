const run = require('firost/lib/run');
const env = require('./env.js');
const config = require('./config.js');
const _ = require('golgoth/lib/lodash');
const { Octokit } = require('@octokit/rest');
const firostError = require('firost/lib/error');

module.exports = {
  /**
   * Returns path the repository root
   * @returns {string} Path to the repo root
   **/
  repoRoot() {
    return process.cwd();
  },
  /**
   * Read an ENV variable
   * @param {string} key Name of the variable
   * @returns {*} ENV value
   **/
  env(key) {
    return env.get(key);
  },
  /**
   * Read a config variable
   * @param {string} key Name of the variable
   * @returns {*} ENV value
   **/
  config(key) {
    return config.get(key);
  },
  /**
   * Run a git command in the repo
   * @param {string} gitCommand Git command to run
   * @returns {string} Command output
   */
  async run(gitCommand) {
    const repoRoot = this.repoRoot();
    const result = await run(`cd ${repoRoot} && ${gitCommand}`, {
      shell: true,
      stdout: false,
    });
    return result.stdout;
  },
  /**
   * Set a git config value only if wasn't set before
   * @param {string} name Name of the config
   * @param {string} value Value of the config
   **/
  async setConfig(name, value) {
    // We test to see if there is already a value. If no, we write it
    try {
      await this.run(`git config ${name}`);
    } catch (err) {
      await this.run(`git config ${name} ${value}`);
    }
  },
  /**
   * Configure git with a name and email
   * Values are either passed as arguments or read from ENV variabmes
   **/
  async configure() {
    if (this.isConfigured) {
      return;
    }
    const email = this.config('gitEmail') || this.env('GIT_USER_EMAIL');
    const name = this.config('gitName') || this.env('GIT_USER_NAME');
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
    await this.configure();
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
    await this.configure();

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
    await this.configure();
    const { branch } = this.repoData();
    const command = `git push --set-upstream origin ${branch}`;
    await this.run(command);
  },
  /**
   * Create an issue with the build error
   * @param {object} err Error object
   **/
  async createIssue(err) {
    const { user, repo } = this.repoData();
    const errorDetails = err.toString();

    const buildUrl = env.get('CIRCLE_BUILD_URL');

    await this.octokit().issues.create({
      owner: user,
      repo: repo,
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
  octokit() {
    if (!this.__octokit) {
      const githubToken = env.get('GITHUB_TOKEN');
      this.__octokit = new Octokit({ auth: githubToken });
    }
    return this.__octokit;
  },
  __octokit: null,
};
