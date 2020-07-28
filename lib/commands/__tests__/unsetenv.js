const current = require('../unsetenv.js');
const envvars = require('../../helpers/envvars.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(envvars, 'setAll').mockReturnValue();
  });
  it('should parse the options as keys', async () => {
    await current(['A_VALUE', 'ANOTHER_VALUE']);
    expect(envvars.setAll).toHaveBeenCalledWith(
      expect.objectContaining({
        A_VALUE: false,
        ANOTHER_VALUE: false,
      })
    );
  });
});
