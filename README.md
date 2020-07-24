# On-circle

Provides a convenient wrapper when running scripts on CircleCI

```js
await onCircle(
  ({
    configureGit,
    configureNpm,
    gitHasChanges,
    success,
    failure,
    gitCommitAndPush,
  }) => {
    // Your own code
  }
);
```

This will catch any error, and will automatically create an issue on your repo
with the details of the error.
