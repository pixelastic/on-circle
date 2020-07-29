const current = require('../github.js');
const gitHelper = require('../git.js');

describe('github', () => {
  beforeEach(async () => {
    jest
      .spyOn(gitHelper, 'repoData')
      .mockReturnValue({ user: 'mock-pixelastic', repo: 'mock-on-circle' });
  });
  describe('addPublicKey', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'call').mockReturnValue();
    });
    it('should call the API to create the key', async () => {
      await current.addPublicKey('--public-key--');
      expect(current.call).toHaveBeenCalledWith(
        'repos.createDeployKey',
        expect.objectContaining({
          owner: 'mock-pixelastic',
          repo: 'mock-on-circle',
          key: '--public-key--',
          read_only: false,
        })
      );
    });
  });
});
