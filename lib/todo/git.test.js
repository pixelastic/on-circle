const current = require('../git.js');
const path = require('path');
const emptyDir = require('firost/lib/emptyDir');
const remove = require('firost/lib/remove');
const write = require('firost/lib/write');
const mkdirp = require('firost/lib/mkdirp');

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
    const tmpRepoRoot = path.resolve('./tmp/git');
    jest.spyOn(current, 'repoRoot').mockReturnValue(tmpRepoRoot);
    await mkdirp(current.repoRoot());
    await emptyDir(current.repoRoot());
    current.isConfigured = false;
  });
  describe('setConfig', () => {
    beforeEach(async () => {
      await initTestRepo();
    });
    it('should set a config value', async () => {
      await current.setConfig('repo.name', 'on-circle');
      const actual = await current.run('git config repo.name');
      expect(actual).toEqual('on-circle');
    });
    it('should not set a config value if already set', async () => {
      await current.setConfig('repo.name', 'on-circle');
      await current.setConfig('repo.name', 'something-else');
      const actual = await current.run('git config repo.name');
      expect(actual).toEqual('on-circle');
    });
  });
  describe('configure', () => {
    beforeEach(async () => {
      jest.spyOn(current, 'setConfig').mockReturnValue();
    });
    it('with env variables', async () => {
      jest.spyOn(current, 'env').mockImplementation((input) => {
        return input;
      });
      await current.configure();
      expect(current.setConfig).toHaveBeenCalledWith(
        'user.email',
        'GIT_USER_EMAIL'
      );
      expect(current.setConfig).toHaveBeenCalledWith(
        'user.name',
        'GIT_USER_NAME'
      );
    });
    it('with custom options', async () => {
      jest.spyOn(current, 'env').mockReturnValue();
      jest.spyOn(current, 'config').mockImplementation((input) => {
        return input;
      });
      await current.configure();
      expect(current.setConfig).toHaveBeenCalledWith('user.email', 'gitEmail');
      expect(current.setConfig).toHaveBeenCalledWith('user.name', 'gitName');
    });
    it('with nothing', async () => {
      jest.spyOn(current, 'env').mockReturnValue();
      let actual;
      try {
        await current.configure();
      } catch (err) {
        actual = err;
      }
      expect(actual).not.toBeEmpty();
    });
  });
  describe('changedFiles', () => {
    beforeEach(async () => {
      current.isConfigured = true;
    });
    it('should return the list of changed files', async () => {
      // Create a reference commit with two files
      const repo = await initTestRepo();
      await write('1', path.resolve(current.repoRoot(), 'one.txt'));
      await write('2', path.resolve(current.repoRoot(), 'two.txt'));
      await repo.commitAll('Initial commit');

      // Edit, Remove and add files
      await write('Uno', path.resolve(current.repoRoot(), 'one.txt'));
      await remove(path.resolve(current.repoRoot(), 'two.txt'));
      await write('3', path.resolve(current.repoRoot(), 'three.txt'));

      const actual = await current.changedFiles();
      expect(actual).toInclude('one.txt');
      expect(actual).toInclude('two.txt');
      expect(actual).toInclude('three.txt');
    });
    it('should return an empty array if no changes', async () => {
      // Create a reference commit with two files
      const repo = await initTestRepo();
      await write('1', path.resolve(current.repoRoot(), 'one.txt'));
      await write('2', path.resolve(current.repoRoot(), 'two.txt'));
      await repo.commitAll('Initial commit');

      const actual = await current.changedFiles();
      expect(actual).toHaveLength(0);
    });
  });
});
