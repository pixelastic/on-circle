const trigger = require('../trigger.js');
module.exports = async (jobName) => {
  await trigger.run(jobName);
};
