const circleCiHelper = require('../helpers/circleci.js');
const _ = require('golgoth/lib/lodash');

module.exports = async (args) => {
  const variables = _.chain(args)
    .map((item) => {
      const [key, value] = item.split('=');
      return { [key]: value };
    })
    .transform((result, value) => {
      _.merge(result, value);
    }, {})
    .value();
  await circleCiHelper.setEnvironmentVariables(variables);
};