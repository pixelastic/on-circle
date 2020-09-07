---
title: on-circle
---

`on-circle` provides a set of utility for configuring and running scripts on
CircleCI.

You can use it **locally**, to automate the scaffolding of your project, or
**remotely**, to simplify some of the most common tasks (push back to a repo,
release on npm, etc).

```sh
# Add the current project to CircleCI
yarn run oncircle follow
# Set an ENV variable
yarn run oncircle setenv API_KEY=4815162342
```

```javascript
// Run this from a job running on CircleCI
const onCircle = require('on-circle');
await onCircle.run(
  async (success, failure, gitChangedFiles, gitCommitAll, gitPush }) => {
    // Run any custom code here, for example calling
    // external APIs to update some data.
    // You can even update the repo and push back
    // using the gitCommitAll() and gitPush() methods

    if (everythingIsOk) {
      return success('Everything worked');
    } else {
      return failure('Something is broken');
    }

    // Oh, and any error will be caught and transformed
    // into a GitHub issue
    }
});
```
