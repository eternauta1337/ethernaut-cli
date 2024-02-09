const debug = require('common/debugger');
const output = require('common/output');
const camelToKebabCase = require('common/kebab');

class Action {
  /**
   * Incoming toolCall is an object with the following structure:
   * {
   *   id: '...',
   *   function: {
   *     name: '...',
   *     arguments: '{"value":"...", "_fix":"..."}'
   *   }
   * }
   *
   * Optional arguments are prefixed with an underscore.
   */
  constructor(toolCall) {
    this.id = toolCall.id;
    this.function = toolCall.function;
  }

  async execute(hre) {
    output.startCollectingOutput();

    // Prepare args
    let args = JSON.parse(this.function.arguments);
    Object.entries(args).forEach(([name, value]) => {
      if (name.includes('_')) {
        args[name.replace('_', '')] = value;
      }
    });

    // Execute
    const nameComponents = this.function.name.split('.');
    if (nameComponents.length === 1) {
      const task = nameComponents[0];
      debug.log(`Calling: ${task} ${args}`, 'ai');
      await hre.run(task, args);
    } else {
      const scope = nameComponents[0];
      const task = nameComponents[1];
      debug.log(`Calling: ${scope} ${task} ${args}`, 'ai');
      await hre.run({ scope, task }, args);
    }

    return {
      tool_call_id: this.id,
      output: output.stopCollectingOutput(),
    };
  }

  /**
   * Converts the tool call to cli syntax like '<scope> <task> --option1 "value1" --option2 "value2"'
   */
  toCliSyntax() {
    // Function name can be '<scope>.<task>' or just '<task>
    // For print out, replace '.' with ' '.
    const name = this.function.name.replace('.', ' ');

    // The first token is task name (with scope if present)
    const tokens = ['ethernaut', name];

    // Arguments and options are mixed in the tool call definition,
    // but option names are marked starting with an underscore.
    const argsAndOpts = JSON.parse(this.function.arguments);
    Object.entries(argsAndOpts).forEach(([name, value]) => {
      const isOption = name.includes('_');

      if (isOption) {
        name = name.substring(1); // Remove underscore
        name = `--${camelToKebabCase(name)}`;
        tokens.push(name);
      }

      tokens.push(`${value}`);
    });

    return tokens.join(' ');
  }
}

module.exports = Action;
