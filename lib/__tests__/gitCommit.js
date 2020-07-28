const current = require('../gitCommit.js');
const circleCiHelper = require('../helpers/circleci.js');
const gitHelper = require('../helpers/git.js');
describe('gitCommit', () => {
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue();
      jest.spyOn(current, '__consoleInfo').mockReturnValue();
      jest.spyOn(circleCiHelper, 'setEnvironmentVariables').mockReturnValue();
      jest.spyOn(gitHelper, 'getConfig').mockReturnValue();
    });
    it('should run a sanity check', async () => {
      await current.run();
      expect(current.sanityCheck).toHaveBeenCalled();
    });
    it('should stop if already configured', async () => {
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue(true);
      const actual = await current.run();
      expect(circleCiHelper.setEnvironmentVariables).not.toHaveBeenCalled();
      expect(actual).toEqual(true);
    });
    it('should save git user.name and git user.email as env variables', async () => {
      jest.spyOn(current, 'isAlreadyConfigured').mockReturnValue(false);
      jest.spyOn(gitHelper, 'getConfig').mockImplementation((name) => {
        const matches = {
          'user.name': 'my_name',
          'user.email': 'me@email.com',
        };
        return matches[name];
      });

      await current.run();

      expect(circleCiHelper.setEnvironmentVariables).toHaveBeenCalledWith({
        GIT_USER_NAME: 'my_name',
        GIT_USER_EMAIL: 'me@email.com',
      });
    });
  });
  describe('sanityCheck', () => {
    it('should pass if token is found', async () => {
      jest.spyOn(circleCiHelper, 'hasToken').mockReturnValue(true);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toEqual(null);
    });
    it('should throw if no circle ci token', async () => {
      jest.spyOn(circleCiHelper, 'hasToken').mockReturnValue(false);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ERROR_CIRCLECI_NO_TOKEN');
    });
  });
  describe('isAlreadyConfigured', () => {
    describe('should return true if both GIT_USER_NAME and GIT_USER_EMAIL are set', () => {
      it.each([
        // GIT_USER_NAME | GIT_USER_EMAIL | expected
        [true, true, true],
        [false, true, false],
        [true, false, false],
        [false, false, false],
      ])(
        'GIT_USER_NAME=%s / GIT_USER_EMAIL=%s',
        async (gitName, gitEmail, expected) => {
          jest
            .spyOn(circleCiHelper, 'isSetEnvironmentVariable')
            .mockImplementation((name) => {
              const matches = {
                GIT_USER_NAME: gitName,
                GIT_USER_EMAIL: gitEmail,
              };
              return matches[name];
            });
          const actual = await current.isAlreadyConfigured();
          expect(actual).toEqual(expected);
        }
      );
    });
  });
});
