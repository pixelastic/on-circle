const current = require('../follow.js');
const config = require('../config.js');
describe('follow', () => {
  beforeEach(async () => {
    jest
      .spyOn(config, 'repoData')
      .mockReturnValue({ user: 'pixelastic', repo: 'on-circle' });
  });
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'sanityCheck').mockReturnValue();
      jest.spyOn(current, 'isAlreadyFollowed').mockReturnValue();
      jest.spyOn(current, '__consoleInfo').mockReturnValue();
      jest.spyOn(current.api, 'follow').mockReturnValue();
    });
    it('should run a sanity check', async () => {
      await current.run();
      expect(current.sanityCheck).toHaveBeenCalled();
    });
    it('should stop if already followed', async () => {
      jest.spyOn(current, 'isAlreadyFollowed').mockReturnValue(true);
      const actual = await current.run();
      expect(actual).toEqual(true);
    });
    it('should follow the current repo', async () => {
      jest.spyOn(current, 'isAlreadyFollowed').mockReturnValue(false);
      await current.run();
      expect(current.api.follow).toHaveBeenCalledWith('pixelastic/on-circle');
    });
  });
  describe('sanityCheck', () => {
    it('should pass if token is found', async () => {
      jest.spyOn(config, 'hasCircleCiToken').mockReturnValue(true);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toEqual(null);
    });
    it('should throw if no circle ci token', async () => {
      jest.spyOn(config, 'hasCircleCiToken').mockReturnValue(false);

      let actual = null;
      try {
        await current.sanityCheck();
      } catch (err) {
        actual = err;
      }
      expect(actual).toHaveProperty('code', 'ERROR_CIRCLECI_NO_TOKEN');
    });
  });
  describe('isAlreadyFollowed', () => {
    it('should return true if in the list', async () => {
      jest
        .spyOn(current.api, 'listProjects')
        .mockReturnValue([{ reponame: 'on-circle', username: 'pixelastic' }]);
      const actual = await current.isAlreadyFollowed();
      expect(actual).toEqual(true);
    });
    it('should return false if not in the list', async () => {
      jest.spyOn(current.api, 'listProjects').mockReturnValue([
        { reponame: 'on-circle', username: 'someone-else' },
        { reponame: 'another-repo', username: 'pixelastic' },
      ]);
      const actual = await current.isAlreadyFollowed();
      expect(actual).toEqual(false);
    });
  });
});
