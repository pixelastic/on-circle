const current = require('../configureGitPush.js');
const circleCiHelper = require('../helpers/circleci.js');
const sshHelper = require('../helpers/ssh.js');
const gitHubHelper = require('../helpers/github.js');
describe('gitPush', () => {
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(current, 'consoleSuccess').mockReturnValue();
      jest.spyOn(sshHelper, 'publicKey').mockReturnValue();
      jest.spyOn(sshHelper, 'privateKey').mockReturnValue();
      jest.spyOn(sshHelper, 'cleanUp').mockReturnValue();
      jest.spyOn(circleCiHelper, 'addPrivateKey').mockReturnValue();
      jest.spyOn(gitHubHelper, 'addPublicKey').mockReturnValue();
    });
    it('should run a sanity check', async () => {
      await current.run();
      expect(current.sanityCheck).toHaveBeenCalled();
    });
    it('should save the private key to circle ci', async () => {
      sshHelper.privateKey.mockReturnValue('==PRIVATE_KEY==');
      await current.run();
      expect(circleCiHelper.addPrivateKey).toHaveBeenCalledWith(
        '==PRIVATE_KEY=='
      );
    });
    it('should save the public key to github', async () => {
      sshHelper.publicKey.mockReturnValue('__public-key__');
      await current.run();
      expect(gitHubHelper.addPublicKey).toHaveBeenCalledWith('__public-key__');
    });
    it('should clean the key folder', async () => {
      await current.run();
      expect(sshHelper.cleanUp).toHaveBeenCalled();
    });
  });
  describe('sanityCheck', () => {
    beforeEach(async () => {
      jest.spyOn(sshHelper, 'hasSshKeygen').mockReturnValue(true);
      jest.spyOn(circleCiHelper, 'hasToken').mockReturnValue(true);
      jest.spyOn(gitHubHelper, 'hasToken').mockReturnValue(true);
    });
    it('should throw if no ssh-keygen', async () => {
      sshHelper.hasSshKeygen.mockReturnValue(false);
      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).not.toEqual(null);
    });
    it('should throw if no CIRCLECI_TOKEN', async () => {
      circleCiHelper.hasToken.mockReturnValue(false);
      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).not.toEqual(null);
    });
    it('should throw if no GITHUB_TOKEN', async () => {
      gitHubHelper.hasToken.mockReturnValue(false);
      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).not.toEqual(null);
    });
  });
});
