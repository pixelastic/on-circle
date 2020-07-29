const sshHelper = require('./helpers/ssh.js');
const gitHubHelper = require('./helpers/github.js');
const circleCiHelper = require('./helpers/circleci.js');
const firostError = require('firost/lib/error');
module.exports = {
  /**
   * Will configure CircleCI so it can push from the repo on GitHub
   * This will create a pair of ssh keys, save the private one on CircleCI and
   * the public one on GitHub
   **/
  async run() {
    await this.sanityCheck();

    const privateKey = await sshHelper.privateKey();
    await circleCiHelper.addPrivateKey(privateKey);

    const publicKey = await sshHelper.publicKey();
    await gitHubHelper.addPublicKey(publicKey);

    await sshHelper.cleanUp();
  },
  /**
   * Check that we can generate a pair of keys, and that we have the required
   * tokens to update config on CircleCI and GitHub
   **/
  async sanityCheck() {
    if (!sshHelper.hasSshKeygen()) {
      throw firostError(
        'ERROR_SSH_NO_SSH_KEYGEN',
        'ssh-keygen was not found in $PATH.'
      );
    }
    if (!gitHubHelper.hasToken()) {
      throw firostError('ERROR_GITHUB_NO_TOKEN', 'No GITHUB_TOKEN found.');
    }
    if (!circleCiHelper.hasToken()) {
      throw firostError('ERROR_CIRCLECI_NO_TOKEN', 'No CIRCLECI_TOKEN found.');
    }
  },
};
