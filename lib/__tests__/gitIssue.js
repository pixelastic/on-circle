const current = require('../gitIssue.js');
const circleCiHelper = require('../helpers/circleci.js');
const gitHubHelper = require('../helpers/github.js');
describe('gitIssue', () => {
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue();
      jest.spyOn(current, '__consoleInfo').mockReturnValue();
      jest.spyOn(circleCiHelper, 'setEnvironmentVariable').mockReturnValue();
      jest.spyOn(gitHubHelper, 'token').mockReturnValue();
    });
    it('should run a sanity check', async () => {
      await current.run();
      expect(current.sanityCheck).toHaveBeenCalled();
    });
    it('should stop if already configured', async () => {
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue(true);
      const actual = await current.run();
      expect(circleCiHelper.setEnvironmentVariable).not.toHaveBeenCalled();
      expect(actual).toEqual(true);
    });
    it('should save GITHUB_TOKEN as env variable', async () => {
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue(false);
      jest.spyOn(gitHubHelper, 'token').mockReturnValue('xxTOKENxx');

      await current.run();

      expect(circleCiHelper.setEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN',
        'xxTOKENxx'
      );
    });
  });
  describe('sanityCheck', () => {
    beforeEach(async () => {
      jest.spyOn(gitHubHelper, 'hasToken').mockReturnValue();
      jest.spyOn(circleCiHelper, 'hasToken').mockReturnValue();
    });
    it('should throw if no github token', async () => {
      gitHubHelper.hasToken.mockReturnValue(false);
      circleCiHelper.hasToken.mockReturnValue(true);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ERROR_GITHUB_NO_TOKEN');
    });
    it('should throw if no circleci token', async () => {
      gitHubHelper.hasToken.mockReturnValue(true);
      circleCiHelper.hasToken.mockReturnValue(false);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ERROR_CIRCLECI_NO_TOKEN');
    });
    it('should pass if both tokens are found', async () => {
      gitHubHelper.hasToken.mockReturnValue(true);
      circleCiHelper.hasToken.mockReturnValue(true);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toEqual(null);
    });
  });
  describe('isAlreadyConfigured', () => {
    it('should return true if GITHUB_TOKEN is already defined on CircleCI', async () => {
      jest
        .spyOn(circleCiHelper, 'isSetEnvironmentVariable')
        .mockReturnValue(true);
      const actual = await current.isAlreadyConfigured();
      expect(actual).toEqual(true);
    });
  });
});
