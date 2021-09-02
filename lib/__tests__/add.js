const current = require('../add.js');
const { tmpDirectory } = require('firost');
const circleCiHelper = require('../helpers/circleci.js');

const Gilmore = require('gilmore');
current.repo = new Gilmore(tmpDirectory('on-circle/add'));

describe('add', () => {
  beforeEach(async () => {
    jest.spyOn(current, '__consoleInfo').mockReturnValue();
    jest.spyOn(current.repo, 'githubRepoSlug').mockReturnValue('user/repo');
  });
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(circleCiHelper, 'add').mockReturnValue();
    });
    it('should stop if sanity check fails', async () => {
      jest.spyOn(current, 'sanityCheck').mockImplementation(() => {
        throw new Error('sanity check failing');
      });

      let actual;
      try {
        await current.run();
      } catch (err) {
        actual = err;
      }

      expect(actual).not.toBeEmpty();
    });
    it('should stop if already added', async () => {
      jest.spyOn(current, 'isAlreadyAdded').mockReturnValue(true);

      await current.run();

      expect(circleCiHelper.add).not.toHaveBeenCalledWith();
    });
    it('should add the current repo', async () => {
      jest.spyOn(current, 'isAlreadyAdded').mockReturnValue(false);

      await current.run();

      expect(circleCiHelper.add).toHaveBeenCalledWith();
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
      expect(actual.message).toInclude(
        'https://app.circleci.com/projects/project-setup/github/user/repo'
      );
    });
  });

  describe('isAlreadyAdded', () => {
    it('should return true if in the list', async () => {
      jest
        .spyOn(circleCiHelper, 'listProjects')
        .mockReturnValue([{ reponame: 'repo', username: 'user' }]);

      const actual = await current.isAlreadyAdded();

      expect(actual).toEqual(true);
    });
    it('should return false if not in the list', async () => {
      jest.spyOn(circleCiHelper, 'listProjects').mockReturnValue([
        { reponame: 'repo', username: 'another-user' },
        { reponame: 'another-repo', username: 'user' },
      ]);
      const actual = await current.isAlreadyAdded();
      expect(actual).toEqual(false);
    });
  });
});
