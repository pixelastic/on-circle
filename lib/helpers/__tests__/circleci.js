const current = require('../circleci.js');
const gitHelper = require('../git.js');
describe('circleci', () => {
  beforeEach(async () => {
    jest
      .spyOn(gitHelper, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
  });
  describe('call', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'token').mockReturnValue('xx-token-xx');
      jest
        .spyOn(current, '__got')
        .mockReturnValue({ body: { responseKey: 'response value' } });
    });
    it('nominal call', async () => {
      const actual = await current.call('pixelastic/on-circle', {
        customOption: true,
      });
      expect(current.__got).toHaveBeenCalledWith(
        'https://circleci.com/api/v1.1/pixelastic/on-circle?circle-token=xx-token-xx',
        expect.objectContaining({
          responseType: 'json',
          customOption: true,
        })
      );

      expect(actual).toHaveProperty('responseKey', 'response value');
    });
  });
  describe('listProjects', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });
    it('nominal call', async () => {
      await current.listProjects();
      expect(current.call).toHaveBeenCalledWith('projects');
    });
  });
  describe('follow', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });
    it('nominal call', async () => {
      await current.follow();
      expect(current.call).toHaveBeenCalledWith(
        'project/github/mock-pixelastic/mock-on-circle/follow',
        expect.objectContaining({ method: 'post' })
      );
    });
  });
  describe('setEnvironmentVariable', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });

    it('nominal call', async () => {
      await current.setEnvironmentVariable('GITHUB_TOKEN', 'xx-token-xx');
      expect(current.call).toHaveBeenCalledWith(
        'project/github/mock-pixelastic/mock-on-circle/envvar',
        expect.objectContaining({
          method: 'post',
          json: {
            name: 'GITHUB_TOKEN',
            value: 'xx-token-xx',
          },
        })
      );
    });
  });
  describe('setEnvironmentVariables', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'setEnvironmentVariable').mockReturnValue();
      jest.spyOn(current, 'unsetEnvironmentVariable').mockReturnValue();
    });
    it('should set/unset all the specified environment variables', async () => {
      await current.setEnvironmentVariables({
        GITHUB_TOKEN: 'xx-token-xx',
        ALGOLIA_API_KEY: '',
        NPM_TOKEN: undefined,
      });
      expect(current.setEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN',
        'xx-token-xx'
      );
      expect(current.unsetEnvironmentVariable).toHaveBeenCalledWith(
        'ALGOLIA_API_KEY'
      );
      expect(current.unsetEnvironmentVariable).toHaveBeenCalledWith(
        'NPM_TOKEN'
      );
    });
  });
  describe('unsetEnvironmentVariable', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });

    it('nominal call', async () => {
      await current.unsetEnvironmentVariable('GITHUB_TOKEN');
      expect(current.call).toHaveBeenCalledWith(
        'project/github/mock-pixelastic/mock-on-circle/envvar/GITHUB_TOKEN',
        expect.objectContaining({
          method: 'delete',
        })
      );
    });
    it('should swallow errors', async () => {
      jest.spyOn(current, 'call').mockImplementation(() => {
        throw new Error();
      });
      let actual = null;
      try {
        await current.unsetEnvironmentVariable('GITHUB_TOKEN');
      } catch (err) {
        actual = err;
      }
      expect(actual).toEqual(null);
    });
  });
  describe('isSetEnvironmentVariable', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });

    it('nominal call', async () => {
      const actual = await current.isSetEnvironmentVariable('GITHUB_TOKEN');
      expect(current.call).toHaveBeenCalledWith(
        'project/github/mock-pixelastic/mock-on-circle/envvar/GITHUB_TOKEN'
      );
      expect(actual).toEqual(true);
    });
    it('should return false if the call errors', async () => {
      jest.spyOn(current, 'call').mockImplementation(() => {
        throw new Error();
      });
      const actual = await current.isSetEnvironmentVariable('GITHUB_TOKEN');
      expect(actual).toEqual(false);
    });
  });
});
