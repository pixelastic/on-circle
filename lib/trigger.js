const { error: firostError } = require('firost');
const circleCiHelper = require('./helpers/circleci.js');
const repo = require('./helpers/repo');

module.exports = {
  async run(jobName) {
    await this.sanityCheck();

    const repoSlug = await this.repo.githubRepoSlug();
    await circleCiHelper.call(`project/github/${repoSlug}/tree/master`, {
      method: 'post',
      form: {
        'build_parameters[CIRCLE_JOB]': jobName,
      },
    });
  },
  async sanityCheck() {
    if (!circleCiHelper.hasToken()) {
      throw firostError(
        'ERROR_CIRCLECI_TRIGGER_NO_TOKEN',
        'You need a CIRCLECI_TOKEN environment variable to trigger a job'
      );
    }
  },
  repo,
};
