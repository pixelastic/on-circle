# On-circle

Provides a set of utility methods for configuring and running scripts on
CircleCi. 

## Installation

```
yarn add --dev on-circle
```

## Following a repository

_⚠ You need a valid `CIRCLECI_TOKEN` variable available for this command to
work_

Will follow the current repository on CircleCI.

### From the command line

`yarn run oncircle follow`

### From JavaScript

```js
const onCircle = require('onCircle');
await onCircle.follow()
```
