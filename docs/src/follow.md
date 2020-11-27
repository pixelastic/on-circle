---
title: Adding a repository
---

Tired of manually clicking the CircleCI interface to add a new repository each
time you're creating a new project? `on-circle` can call the CircleCI API for
you.

```bash
# From the command line
yarn run oncircle follow
```

```javascript
// From your script
const onCircle = require('on-circle');
await onCircle.follow();
```

Your current repository is now added to CircleCI.

## Notes

⚠ You will need a valid `CIRCLECI_TOKEN` available for this command to work.
