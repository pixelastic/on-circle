const current = require('../setenv.js');
const circleCiHelper = require('../../helpers/circleci.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(circleCiHelper, 'setEnvironmentVariables').mockReturnValue();
  });
  it('should parse the options as key/values', async () => {
    await current([
      'A_VALUE=something',
      'A_NUMBER=42',
      'NOTHING=',
      'EVEN_MORE_NOTHING',
    ]);
    expect(circleCiHelper.setEnvironmentVariables).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: 'something',
        A_NUMBER: '42',
        NOTHING: '',
        EVEN_MORE_NOTHING: undefined,
      })
    );
  });
});
