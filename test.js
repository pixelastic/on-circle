// const onCircle = require('./lib/main.js');
const envvars = require('./lib/helpers/envvars.js');
(async () => {
  const isSet = await envvars.isSet('GIT_USER_NAME');
  console.info(isSet);
})();
