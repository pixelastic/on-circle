const current = require('../api.js');
const config = require('../../config.js');
describe('helpers > api', () => {
  beforeEach(async () => {
    jest
      .spyOn(config, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
  });
  describe('call', () => {
    beforeEach(async () => {
      jest.spyOn(config, 'circleCiToken').mockReturnValue('xx-token-xx');
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
});
