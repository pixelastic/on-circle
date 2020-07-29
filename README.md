# On-circle

Provides a set of utility methods for configuring and running scripts on
CircleCi.

## Installation

`yarn add --dev on-circle`

## Commands

### Following a repository

_⚠ You need a valid `CIRCLECI_TOKEN` variable available for this command to
work_

`yarn run oncircle follow`

```js
const onCircle = require('onCircle');
await onCircle.follow()
```

### Setting/unsetting environment variables

_⚠ You need a valid `CIRCLECI_TOKEN` variable available for this command to
work_

`yarn run oncircle setenv MY_VAR=my_value MY_OTHER_VAR=my_other_value` will set
the `MY_VAR` and `MY_OTHER_VAR` environment variables.

To remove variables, use `yarn run oncircle unsetenv MY_VAR MY_OTHER_VAR`.

Or, in Javascript:

```js
const onCircle = require('onCircle');
await onCircle.setEnvironmentVariables({
  MY_VAR: 'my-value',
  MY_OTHER_VAR: null // Pass a falsy value to remove the environment value
});
```

### Running a script in a sandbox

The `onCircle.run()` method allows you to run your custom JavaScript code in
CircleCI in a sandbox, providing a few utilities:

- All errors will be caught and logged as GitHub issues
- You can easily define the job status using the `success(message)` and
  `failure(message)`
- The `gitChangedFiles()`, `gitCommitAll()` and `gitPush()` methods are
  available for easy updating of the repo

### Configuring git

_⚠ You need a valid `CIRCLECI_TOKEN` and `GITHUB_TOKEN` variables available, as
well as `ssh-keygen` in your `$PATH` for this command to work_

`yarn run oncircle git` will configure your CircleCI project so you can commit
and push back to the original repo from your job. It will also create an issue
on your repository when method ran through `onCircle.run` throw errors.

These steps can be enabled manually in JavaScript through the
`onCircle.configureGitCommit()`, `onCircle.configureGitPush()` and
`onCircle.configureGitIssue()` methods.
