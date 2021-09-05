---
title: follow
---

<div class="lead">Follow the repository on CircleCI</div>

This will follow the repository on CircleCI, meaning that any
new push to the repo will trigger a build.

```bash
# From the command line
yarn run oncircle follow
```

```javascript
// From JavaScript
const onCircle = require('on-circle');
await onCircle.follow();
```
