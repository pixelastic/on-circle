const current = require('../add.js');
const gitHelper = require('../helpers/git.js');
const circleCiHelper = require('../helpers/circleci.js');
describe('add', () => {
  beforeEach(async () => {
    jest
      .spyOn(gitHelper, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
  });
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(current, 'isAlreadyAdded').mockReturnValue();
      jest.spyOn(current, '__consoleInfo').mockReturnValue();
      jest.spyOn(circleCiHelper, 'add').mockReturnValue();
    });
    it('should run a sanity check', async () => {
      await current.run();
      expect(current.sanityCheck).toHaveBeenCalled();
    });
    it('should stop if already added', async () => {
      jest.spyOn(current, 'isAlreadyAdded').mockReturnValue(true);
      const actual = await current.run();
      expect(actual).toEqual(true);
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
    });
  });
  describe('isAlreadyAdded', () => {
    it('should return true if in the list', async () => {
      jest
        .spyOn(circleCiHelper, 'listProjects')
        .mockReturnValue([
          { reponame: 'mock-on-circle', username: 'mock-pixelastic' },
        ]);
      const actual = await current.isAlreadyAdded();
      expect(actual).toEqual(true);
    });
    it('should return false if not in the list', async () => {
      jest.spyOn(circleCiHelper, 'listProjects').mockReturnValue([
        { reponame: 'mock-on-circle', username: 'someone-else' },
        { reponame: 'another-repo', username: 'mock-pixelastic' },
      ]);
      const actual = await current.isAlreadyAdded();
      expect(actual).toEqual(false);
    });
  });
});
