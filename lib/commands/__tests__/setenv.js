const current = require('../setenv.js');
const lib = require('../../setenv.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(lib, 'run').mockReturnValue();
  });
  it('should parse the options as key/values', async () => {
    await current([
      'A_VALUE=something',
      'A_NUMBER=42',
      'NOTHING=',
      'EVEN_MORE_NOTHING',
    ]);
    expect(lib.run).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: 'something',
        A_NUMBER: '42',
        NOTHING: '',
        EVEN_MORE_NOTHING: undefined,
      })
    );
  });
});
