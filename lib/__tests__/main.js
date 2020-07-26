const current = require('../main.js');

describe('main', () => {
  describe('run', () => {
    describe('not on CircleCI', () => {
      beforeEach(async () => {
        jest.spyOn(current, 'isCircleCi').mockReturnValue(false);
        jest.spyOn(current, '__consoleError').mockReturnValue();
      });
      it('should stop early', async () => {
        const callback = jest.fn();
        await current.run(callback);
        expect(callback).not.toHaveBeenCalled();
      });
    });
    describe('on CircleCI', () => {
      beforeEach(async () => {
        jest.spyOn(current, 'isCircleCi').mockReturnValue(true);
        jest.spyOn(current, 'success').mockReturnValue();
        jest.spyOn(current, 'failure').mockReturnValue();
        jest.spyOn(current, 'createIssue').mockReturnValue();
      });
      it('build succeed if method returns true', async () => {
        const callback = jest.fn().mockReturnValue(true);
        await current.run(callback);
        expect(current.success).toHaveBeenCalled();
        expect(current.failure).not.toHaveBeenCalled();
      });
      it('build fails if method returns false', async () => {
        const callback = jest.fn().mockReturnValue(false);
        await current.run(callback);
        expect(current.success).not.toHaveBeenCalled();
        expect(current.failure).toHaveBeenCalled();
      });
      it('issue created if method errors', async () => {
        const error = new Error('Something is wrong');
        const callback = jest.fn().mockImplementation(() => {
          throw error;
        });
        await current.run(callback);
        expect(current.failure).toHaveBeenCalled();
        expect(current.createIssue).toHaveBeenCalledWith(error);
      });
    });
  });
});
