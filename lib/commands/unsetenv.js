const envvars = require('../helpers/envvars.js');
const _ = require('golgoth/lib/lodash');

module.exports = async (args) => {
  const variables = _.transform(
    args,
    (result, name) => {
      result[name] = false;
    },
    {}
  );
  await envvars.setAll(variables);
};
