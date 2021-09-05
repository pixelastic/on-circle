---
title: run
---

<div class="lead">Run any code from inside a CircleCI job sandbox.</div>

This methods makes running and debugging code on CircleCI more enjoyable.
Specifically it:

- Prevent execution if not running on CircleCI
- Catch errors and create GitHub issues instead
- Provides syntactic sugar `.success()` and `.error()` methods
- Provides a [Gilmore](https://projects.pixelastic.com/gilmore/) `repo` instance

```javascript
// Run this from a job running on CircleCI
const onCircle = require('on-circle');
await onCircle.run(
  async (success, failure, repo }) => {
    // Run any custom code here, for example calling
    // external APIs to update some data.
    // You can even update the repo and push back
    // (check https://projects.pixelastic.com/gilmore/ for documentation)

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

## Notes

Note that this method requires some additional configuration to work.
Specifically, CircleCi and GitHub must be configured so they can talk to each
other. Check the [installation][1] page for more information.

[1]: /installation/
