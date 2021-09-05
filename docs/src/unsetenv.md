---
title: unsetenv
---

<div class="lead">Deletes an environment variable on CircleCI</div>

This will remove one or several environment variables from your CircleCI
project.

## Command line

```bash
yarn run setenv USER_NAME API_KEY
```

## JavaScript

```javascript
const onCircle = require('on-circle');
await onCircle.setEnvironmentVariables({
  USER_NAME: false,
  API_KEY: false,
});
```
