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
  async publicKey() {
    return await this.getKeyContent('key.pub');
  },
  async privateKey() {
    return await this.getKeyContent('key');
  },
  async getKeyContent(basename) {
    const keyPath = path.resolve(this.keysDirectory(), basename);
    if (!(await exists(keyPath))) {
      await this.generateKeys();
    }

    return await read(keyPath);
  },
  keysDirectory() {
    if (!this.__keysDirectory) {
      this.__keysDirectory = tmpDirectory('on-circle');
    }
    return this.__keysDirectory;
  },
  __keysDirectory: null,
  async hasSshKeygen() {
    const sshKeygenPath = await this.which('ssh-keygen');
    return !!sshKeygenPath;
  },
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
  async cleanUp() {
    await remove(this.keysDirectory());
  },
  run,
  which,
};
