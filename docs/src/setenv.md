---
title: setenv
---

<div class="lead">Sets an environment variable on CircleCI</div>

This will set one or multiple environment variables to be available in your
CircleCI run environment. Any existing environment variable will be overwritten.
See [unsetenv](/unsetenv/) to delete an environment variable.

## Command line

```bash
# Passing the key and the value
yarn run setenv USER_NAME=tim

# Passing only the key will read the value from the host ENV variables
yarn run setenv API_KEY

# You can also set several variables in one call
yarn run setenv USER_NAME=time API_KEY
```

## JavaScript

```javascript
const onCircle = require('on-circle');
await onCircle.setEnvironmentVariables({
  USER_NAME: 'tim',
  API_KEY: '4815162343',
});
```
