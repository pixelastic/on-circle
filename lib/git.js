const run = require('firost/lib/run');
const env = require('./env.js');

module.exports = {
  isConfigured: false,
  async configure() {
    const email = env.get('GIT_USER_EMAIL');
    const name = env.get('GIT_USER_NAME');
    await this.setConfig('user.email', email);
    await this.setConfig('user.name', name);
    this.isConfigured = true;
  },
  /**
   * Check if the records have changed
   * @returns {boolean} True if records changed
   **/
  async changedFiles() {
    if (!this.isConfigured) {
      await this.configure();
    }
    return await run('git diff --name-only', { stdout: false });
  },
  /**
   * Set a git config value only if wasn't set before
   * @param {string} name Name of the config
   * @param {string} value Value of the config
   **/
  async setConfig(name, value) {
    // We test to see if there is already a value. If no, we write it
    try {
      await run(`git config ${name}`);
    } catch (err) {
      await run(`git config ${name} ${value}`);
    }
  },
  async commitAll(commitMessage) {
    if (!this.isConfigured) {
      await this.configure();
    }
    await run('git add --all .');
    await run(
      `git commit --no-verify --message "${commitMessage}" --message "[skip ci]"`,
      { shell: true }
    );
  },
  async push() {
    if (!this.isConfigured) {
      await this.configure();
    }
    await run('git push --set-upstream origin master');
  },
};
