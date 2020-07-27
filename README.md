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
