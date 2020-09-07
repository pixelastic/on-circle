---
title: oncircle setenv / oncircle unsetenv
---

`on-circle` can set or unset remote `ENV` vars from your CircleCI project
without you needing to navigate the UI.

```bash
# Set ENV variables
yarn run oncircle setenv USER_NAME=tim API_KEY=4815162342

# Unset them
yarn run oncircle unsetenv USER_NAME API_KEY
```

```javascript
const onCircle = require('on-circle');
await onCircle.setEnvironmentVariables({
  USER_NAME: 'tim',
  API_KEY: '4815162343',
});

// Pass falsy values to remove theme
await onCircle.setEnvironmentVariables({
  USER_NAME: false,
  API_KEY: false,
});
```

## Notes

⚠ You will need a valid `CIRCLECI_TOKEN` available for this command to work.
