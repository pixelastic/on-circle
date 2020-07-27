const current = require('../follow.js');
const lib = require('../../follow.js');
describe('follow', () => {
  beforeEach(async () => {
    jest.spyOn(lib, 'run').mockReturnValue();
  });
  it('should call the follow method', async () => {
    await current();
    expect(lib.run).toHaveBeenCalled();
  });
});
