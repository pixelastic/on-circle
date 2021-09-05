const circleCiHelper = require('../helpers/circleci.js');
const _ = require('golgoth/lodash');

module.exports = async (args) => {
  const variables = _.chain(args)
    .map((item) => {
      let key, value;
      if (_.includes(item, '=')) {
        [key, value] = item.split('=');
      } else {
        key = item;
        value = process.env[key];
      }
      return { [key]: value };
    })
    .transform((result, value) => {
      _.merge(result, value);
    }, {})
    .value();
  await circleCiHelper.setEnvironmentVariables(variables);
};
