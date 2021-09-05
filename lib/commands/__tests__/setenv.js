const current = require('../setenv.js');
const circleCiHelper = require('../../helpers/circleci.js');
describe('setenv', () => {
  const envSnapshot = { ...process.env };
  beforeEach(async () => {
    jest.spyOn(circleCiHelper, 'setEnvironmentVariables').mockReturnValue();
  });
  afterEach(() => {
    process.env = { ...envSnapshot };
  });
  it('should parse the options as key/values', async () => {
    process.env.AN_ENV_VAR = 'an-env-var';
    await current([
      'A_STRING=something',
      'A_NUMBER=42',
      'AN_EMPTY_STRING=',
      'AN_ENV_VAR',
    ]);
    expect(circleCiHelper.setEnvironmentVariables).toHaveBeenCalledWith(
      expect.objectContaining({
        A_STRING: 'something',
        A_NUMBER: '42',
        AN_EMPTY_STRING: '',
        AN_ENV_VAR: 'an-env-var',
      })
    );
  });
});
