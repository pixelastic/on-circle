const current = require('../ssh.js');
const os = require('os');
const exists = require('firost/exists');
const path = require('path');

describe('ssh', () => {
  beforeEach(async () => {
    current.__keysDirectory = null;
  });
  describe('keysDirectory', () => {
    it('should return a random tmp folder', async () => {
      const actual = current.keysDirectory();
      expect(actual).toStartWith(os.tmpdir());
    });
    it('should always return the same folder in a given run', async () => {
      const actual = current.keysDirectory();
      current.keysDirectory();
      const expected = current.keysDirectory();
      expect(actual).toEqual(expected);
    });
  });
  describe('hasSshKeygen', () => {
    it('should check if ssh-keygen is available', async () => {
      jest.spyOn(current, 'which').mockReturnValue();
      await current.hasSshKeygen();
      expect(current.which).toHaveBeenCalledWith('ssh-keygen');
    });
    it('should return true if ssh-keygen is available', async () => {
      jest.spyOn(current, 'which').mockReturnValue('/usr/bin/ssh-keygen');
      const actual = await current.hasSshKeygen();
      expect(actual).toEqual(true);
    });
    it('should return false if ssh-keygen is not available', async () => {
      jest.spyOn(current, 'which').mockReturnValue(false);
      const actual = await current.hasSshKeygen();
      expect(actual).toEqual(false);
    });
  });
  describe('generateKeys', () => {
    afterEach(async () => {
      await current.cleanUp();
    });
    it('should generate keys in the keysDirectory', async () => {
      await current.generateKeys();

      const keysDirectory = current.keysDirectory();
      expect(await exists(path.resolve(keysDirectory, 'key'))).toEqual(true);
      expect(await exists(path.resolve(keysDirectory, 'key.pub'))).toEqual(
        true
      );
    });
  });
});
