const onCircle = require('../lib/main.js');
const dayjs = require('golgoth/lib/dayjs');
const write = require('firost/lib/write');
const _ = require('golgoth/lib/lodash');
const uuid = require('firost/lib/uuid');

(async () => {
  await onCircle.run(
    async ({ success, gitChangedFiles, gitCommitAll, gitPush }) => {
      await write(uuid(), './foo.txt');

      const changedFiles = await gitChangedFiles();

      if (_.isEmpty(changedFiles)) {
        return success('No files changed, we stop early');
      }

      // Commit changes
      const currentDate = dayjs().format('YYYY-MM-DD');
      const commitMessage = `chore(ci): Daily update (${currentDate})`;
      await gitCommitAll(commitMessage);

      // And push
      await gitPush();
    }
  );
})();
