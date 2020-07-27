const current = require('../api.js');
const config = require('../../config.js');
describe('helpers > api', () => {
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
      await current.follow('pixelastic/on-circle');
      expect(current.call).toHaveBeenCalledWith(
        'project/github/pixelastic/on-circle/follow',
        expect.objectContaining({ method: 'post' })
      );
    });
  });
});
