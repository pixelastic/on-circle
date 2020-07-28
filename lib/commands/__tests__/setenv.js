const current = require('../setenv.js');
const envvars = require('../../helpers/envvars.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(envvars, 'setAll').mockReturnValue();
  });
  it('should parse the options as key/values', async () => {
    await current([
      'A_VALUE=something',
      'A_NUMBER=42',
      'NOTHING=',
      'EVEN_MORE_NOTHING',
    ]);
    expect(envvars.setAll).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: 'something',
        A_NUMBER: '42',
        NOTHING: '',
        EVEN_MORE_NOTHING: undefined,
      })
    );
  });
});
