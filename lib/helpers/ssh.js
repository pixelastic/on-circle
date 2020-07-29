const tmpDirectory = require('firost/lib/tmpDirectory');
const exists = require('firost/lib/exists');
const read = require('firost/lib/read');
const run = require('firost/lib/run');
const remove = require('firost/lib/remove');
const mkdirp = require('firost/lib/mkdirp');
const path = require('path');
const gitHelper = require('./git.js');
const which = require('firost/lib/which');

module.exports = {
  /**
   * Returns the public key of a freshly generated pair
   * @returns {string} Content of the public key
   **/
  async publicKey() {
    return await this.getKeyContent('key.pub');
  },
  /**
   * Returns the private key of a freshly generated pair
   * @returns {string} Content of the private key
   **/
  async privateKey() {
    return await this.getKeyContent('key');
  },
  /**
   * Utility method to get the content of any file in the keysDirectory
   * Note: A pair will be generated on the first call of this method
   * @param {string} basename Name of the file to read in the keysDirectory
   * @returns {string} Content of the file
   **/
  async getKeyContent(basename) {
    const keyPath = path.resolve(this.keysDirectory(), basename);
    if (!(await exists(keyPath))) {
      await this.generateKeys();
    }

    return await read(keyPath);
  },
  /**
   * Returns a path to a temporary folder where we'll generate the keys
   * Multiple calls will always return the same random path
   * @returns {string} Path to the folder
   **/
  keysDirectory() {
    if (!this.__keysDirectory) {
      this.__keysDirectory = tmpDirectory('on-circle');
    }
    return this.__keysDirectory;
  },
  __keysDirectory: null,
  /**
   * Check if ssh-keygen is available
   * @returns {boolean} True if available, false otherwise
   **/
  async hasSshKeygen() {
    const sshKeygenPath = await this.which('ssh-keygen');
    return !!sshKeygenPath;
  },
  /**
   * Generate a pair of keys in a random directory
   **/
  async generateKeys() {
    const keysDirectory = this.keysDirectory();
    await mkdirp(keysDirectory);

    const email = await gitHelper.getConfig('user.email');
    const keyPath = path.resolve(keysDirectory, 'key');
    const sshKeygenArguments = [
      '-m PEM',
      '-t rsa',
      `-C ${email}`,
      `-f ${keyPath}`,
      "-N ''",
    ];
    const command = `ssh-keygen ${sshKeygenArguments.join(' ')}`;
    // Need to run in shell mode, otherwise does not understand the empty
    // passphrase
    await this.run(command, { shell: true, stdout: false });
  },
  /**
   * Remove the random directory
   **/
  async cleanUp() {
    await remove(this.keysDirectory());
  },
  run,
  which,
};
