const current = require('../envvars.js');
const config = require('../../config.js');
describe('follow', () => {
  beforeEach(async () => {
    jest
      .spyOn(config, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
    jest.spyOn(current.api, 'unsetEnvironmentVariable').mockReturnValue();
    jest.spyOn(current.api, 'setEnvironmentVariable').mockReturnValue();
    jest.spyOn(current.api, 'isSetEnvironmentVariable').mockReturnValue();
  });
  describe('setAll', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'set').mockReturnValue();
      jest.spyOn(current, 'unset').mockReturnValue();
    });
    it('should set/unset all the specified environment variables', async () => {
      await current.setAll({
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
  describe('isSet', () => {
    it('should call the api to check unset the value', async () => {
      await current.isSet('GITHUB_TOKEN');
      expect(current.api.isSetEnvironmentVariable).toHaveBeenCalledWith(
        'GITHUB_TOKEN'
      );
    });
  });
});
