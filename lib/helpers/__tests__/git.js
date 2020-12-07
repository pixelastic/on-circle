const current = require('../git.js');
const path = require('path');
const emptyDir = require('firost/emptyDir');
const remove = require('firost/remove');
const write = require('firost/write');
const mkdirp = require('firost/mkdirp');
const os = require('os');
const envHelper = require('../env.js');

const initTestRepo = async function () {
  await current.run('git init');
  await current.run('git config user.name Tester');
  await current.run('git config user.email tester@oncircle.com');
  return {
    async commitAll(commitMessage) {
      await current.run('git add --all .');
      await current.run(`git commit -m "${commitMessage}"`);
    },
  };
};

describe('git', () => {
  beforeEach(async () => {
    const tmpRepoRoot = path.resolve(os.tmpdir(), 'on-circle', 'test', 'git');
    jest.spyOn(current, 'repoData').mockReturnValue({ root: tmpRepoRoot });
    await mkdirp(tmpRepoRoot);
    await emptyDir(tmpRepoRoot);
  });
  describe('getConfig', () => {
    beforeEach(async () => {
      await initTestRepo();
    });
    it('should return false if no value', async () => {
      const actual = await current.getConfig('repo.name');
      expect(actual).toEqual(false);
    });
    it('should return the existing value', async () => {
      await current.setConfig('repo.name', 'my_repo');
      const actual = await current.getConfig('repo.name');
      expect(actual).toEqual('my_repo');
    });
  });
  describe('setConfig', () => {
    beforeEach(async () => {
      await initTestRepo();
    });
    it('should set a config value', async () => {
      await current.setConfig('repo.name', 'my_repo');
      const actual = await current.getConfig('repo.name');
      expect(actual).toEqual('my_repo');
    });
    it('should overwrite an existing value', async () => {
      await current.setConfig('repo.name', 'my_repo');
      await current.setConfig('repo.name', 'my_other_repo');
      const actual = await current.getConfig('repo.name');
      expect(actual).toEqual('my_other_repo');
    });
  });
  describe('preRun', () => {
    beforeEach(async () => {
      current.isConfigured = false;
      jest.spyOn(envHelper, 'get').mockReturnValue();
      jest.spyOn(current, 'setConfig').mockReturnValue();
    });
    it('should not run again if already configured', async () => {
      current.isConfigured = true;
      await current.preRun();
      expect(current.setConfig).not.toHaveBeenCalled();
    });
    it('should throw an error if no email', async () => {
      jest.spyOn(envHelper, 'get').mockImplementation((input) => {
        const hashes = {
          GIT_USER_NAME: 'pixelastic',
        };
        return hashes[input];
      });

      let actual;
      try {
        await current.preRun();
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('code', 'GIT_ERROR_NO_EMAIL');
    });
    it('should throw an error if no name', async () => {
      jest.spyOn(envHelper, 'get').mockImplementation((input) => {
        const hashes = {
          GIT_USER_EMAIL: 'tim@dev.com',
        };
        return hashes[input];
      });

      let actual;
      try {
        await current.preRun();
      } catch (err) {
        actual = err;
      }

      expect(actual).toHaveProperty('code', 'GIT_ERROR_NO_NAME');
    });
    it('should set both email and name and mark as configured', async () => {
      jest.spyOn(envHelper, 'get').mockImplementation((input) => {
        return input;
      });

      await current.preRun();

      expect(current.setConfig).toHaveBeenCalledWith(
        'user.email',
        'GIT_USER_EMAIL'
      );
      expect(current.setConfig).toHaveBeenCalledWith(
        'user.name',
        'GIT_USER_NAME'
      );
      expect(current.isConfigured).toEqual(true);
    });
  });

  describe('changedFiles', () => {
    beforeEach(async () => {
      current.isConfigured = true;
    });
    it('should return the list of changed files', async () => {
      // Create a reference commit with two files
      const repo = await initTestRepo();
      const { root } = await current.repoData();
      await write('1', path.resolve(root, 'one.txt'));
      await write('2', path.resolve(root, 'two.txt'));
      await repo.commitAll('Initial commit');

      // Edit, Remove and add files
      await write('Uno', path.resolve(root, 'one.txt'));
      await remove(path.resolve(root, 'two.txt'));
      await write('3', path.resolve(root, 'three.txt'));

      const actual = await current.changedFiles();
      expect(actual).toInclude('one.txt');
      expect(actual).toInclude('two.txt');
      expect(actual).toInclude('three.txt');
    });
    it('should return an empty array if no changes', async () => {
      // Create a reference commit with two files
      const repo = await initTestRepo();
      const { root } = await current.repoData();
      await write('1', path.resolve(root, 'one.txt'));
      await write('2', path.resolve(root, 'two.txt'));
      await repo.commitAll('Initial commit');

      const actual = await current.changedFiles();
      expect(actual).toHaveLength(0);
    });
  });
});
