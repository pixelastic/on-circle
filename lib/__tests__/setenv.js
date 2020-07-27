const current = require('../setenv.js');
const config = require('../config.js');
describe('follow', () => {
  beforeEach(async () => {
    jest
      .spyOn(config, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
    jest.spyOn(current.api, 'unsetEnvironmentVariable').mockReturnValue();
    jest.spyOn(current.api, 'setEnvironmentVariable').mockReturnValue();
  });
  describe('run', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'set').mockReturnValue();
      jest.spyOn(current, 'unset').mockReturnValue();
    });
    it('should set/unset all the specified environment variables', async () => {
      await current.run({
        GITHUB_TOKEN: 'xx-token-xx',
        ALGOLIA_API_KEY: '',
        NPM_TOKEN: undefined,
      });
      expect(current.set).toHaveBeenCalledWith('GITHUB_TOKEN', 'xx-token-xx');
      expect(current.unset).toHaveBeenCalledWith('ALGOLIA_API_KEY');
      expect(current.unset).toHaveBeenCalledWith('NPM_TOKEN');
    });
  });
  describe('set', () => {
    it('should unset the var and re-add it', async () => {
      await current.set('GITHUB_TOKEN', 'xx-token-xx');
      expect(current.api.unsetEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN'
      );
      expect(current.api.setEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN',
        'xx-token-xx'
      );
    });
  });
  describe('unset', () => {
    it('should call the api to unset the value', async () => {
      await current.unset('GITHUB_TOKEN');
      expect(current.api.unsetEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN'
      );
    });
  });
});
