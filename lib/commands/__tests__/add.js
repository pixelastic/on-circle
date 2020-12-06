const current = require('../add.js');
const lib = require('../../add.js');
describe('add', () => {
  beforeEach(async () => {
    jest.spyOn(lib, 'run').mockReturnValue();
  });
  it('should call the add method', async () => {
    await current();
    expect(lib.run).toHaveBeenCalled();
  });
});
