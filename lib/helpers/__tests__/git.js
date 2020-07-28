const current = require('../git.js');
const config = require('../../config.js');
const path = require('path');
const emptyDir = require('firost/lib/emptyDir');
const remove = require('firost/lib/remove');
const write = require('firost/lib/write');
const mkdirp = require('firost/lib/mkdirp');
const os = require('os');

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
    jest.spyOn(config, 'repoData').mockReturnValue({ root: tmpRepoRoot });
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
  // describe('configure', () => {
  //   beforeEach(async () => {
  //     jest.spyOn(current, 'setConfig').mockReturnValue();
  //   });
  //   it('with env variables', async () => {
  //     jest.spyOn(current, 'env').mockImplementation((input) => {
  //       return input;
  //     });
  //     await current.configure();
  //     expect(current.setConfig).toHaveBeenCalledWith(
  //       'user.email',
  //       'GIT_USER_EMAIL'
  //     );
  //     expect(current.setConfig).toHaveBeenCalledWith(
  //       'user.name',
  //       'GIT_USER_NAME'
  //     );
  //   });
  //   it('with custom options', async () => {
  //     jest.spyOn(current, 'env').mockReturnValue();
  //     jest.spyOn(current, 'config').mockImplementation((input) => {
  //       return input;
  //     });
  //     await current.configure();
  //     expect(current.setConfig).toHaveBeenCalledWith('user.email', 'gitEmail');
  //     expect(current.setConfig).toHaveBeenCalledWith('user.name', 'gitName');
  //   });
  //   it('with nothing', async () => {
  //     jest.spyOn(current, 'env').mockReturnValue();
  //     let actual;
  //     try {
  //       await current.configure();
  //     } catch (err) {
  //       actual = err;
  //     }
  //     expect(actual).not.toBeEmpty();
  //   });
  // });
  // describe('changedFiles', () => {
  //   beforeEach(async () => {
  //     current.isConfigured = true;
  //   });
  //   it('should return the list of changed files', async () => {
  //     // Create a reference commit with two files
  //     const repo = await initTestRepo();
  //     await write('1', path.resolve(current.repoRoot(), 'one.txt'));
  //     await write('2', path.resolve(current.repoRoot(), 'two.txt'));
  //     await repo.commitAll('Initial commit');

  //     // Edit, Remove and add files
  //     await write('Uno', path.resolve(current.repoRoot(), 'one.txt'));
  //     await remove(path.resolve(current.repoRoot(), 'two.txt'));
  //     await write('3', path.resolve(current.repoRoot(), 'three.txt'));

  //     const actual = await current.changedFiles();
  //     expect(actual).toInclude('one.txt');
  //     expect(actual).toInclude('two.txt');
  //     expect(actual).toInclude('three.txt');
  //   });
  //   it('should return an empty array if no changes', async () => {
  //     // Create a reference commit with two files
  //     const repo = await initTestRepo();
  //     await write('1', path.resolve(current.repoRoot(), 'one.txt'));
  //     await write('2', path.resolve(current.repoRoot(), 'two.txt'));
  //     await repo.commitAll('Initial commit');

  //     const actual = await current.changedFiles();
  //     expect(actual).toHaveLength(0);
  //   });
  // });
});
