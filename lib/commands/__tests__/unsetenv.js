const current = require('../unsetenv.js');
const circleCiHelper = require('../../helpers/circleci.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(circleCiHelper, 'setEnvironmentVariables').mockReturnValue();
  });
  it('should parse the options as keys', async () => {
    await current(['A_VALUE', 'ANOTHER_VALUE']);
    expect(circleCiHelper.setEnvironmentVariables).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: false,
        ANOTHER_VALUE: false,
      })
    );
  });
});
