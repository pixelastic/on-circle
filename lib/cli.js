const minimist = require('minimist');
const { consoleError, exit } = require('firost');
const { _ } = require('golgoth');

module.exports = {
  /**
   * List of allowed commands to run
   * @returns {Array} List of allowed commands to run
   **/
  safelist() {
    return ['follow', 'git', 'setenv', 'unsetenv', 'trigger'];
  },
  /**
   * Run the command specified on the command-line, along with specific
   * arguments
   * @param {Array} rawArgs CLI args
   **/
  async run(rawArgs) {
    const args = minimist(rawArgs);

    const commandName = args._[0];
    if (!_.includes(this.safelist(), commandName)) {
      this.__consoleError(`Unknown command ${commandName}`);
      this.__exit(1);
      return;
    }

    // Remove the initial method from args passed to the command
    args._ = _.drop(args._, 1);

    try {
      const command = this.__require(`./commands/${commandName}`);
      await command(args._);
    } catch (err) {
      this.__consoleError(err.message);
      this.__exit(1);
    }
  },
  __consoleError: consoleError,
  __exit: exit,
  __require: require,
};
