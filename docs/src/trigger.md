---
title: trigger
---

<div class="lead">Trigger a specific job</div>

This will trigger a specific job to run. Useful for debugging scheduled job
without waiting for the cron to execute.

## Command line

```bash
# Will trigger the dailyUpdate job
yarn run trigger dailyUpdate
```

## JavaScript

```javascript
const onCircle = require('on-circle');
await onCircle.trigger('dailyUpdate');
```
