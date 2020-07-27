const current = require('../setenv.js');
const lib = require('../../setenv.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(lib, 'run').mockReturnValue();
  });
  it('should parse the options as keys', async () => {
    await current(['A_VALUE', 'ANOTHER_VALUE']);
    expect(lib.run).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: undefined,
        ANOTHER_VALUE: undefined,
      })
    );
  });
});
