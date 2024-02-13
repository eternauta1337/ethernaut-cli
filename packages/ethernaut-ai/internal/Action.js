const debug = require('common/debug');
const output = require('common/output');
const camelToKebabCase = require('common/kebab');
const chalk = require('chalk');

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
  constructor(toolCall, hre) {
    this.hre = hre;
    this.id = toolCall.id;
    this.function = toolCall.function;
    this.parseTask();
    this.parseArgs();
  }

  parseTask() {
    const nameComponents = this.function.name.split('.');

    if (nameComponents.length === 1) {
      this.taskName = nameComponents[0];
    } else {
      this.scopeName = nameComponents[0];
      this.taskName = nameComponents[1];
    }

    if (this.scopeName) {
      this.scope = this.hre.scopes[this.scopeName];
      this.task = this.scope.tasks[this.taskName];
    } else {
      this.task = this.hre.tasks[this.taskName];
    }
  }

  parseArgs() {
    this.args = JSON.parse(this.function.arguments);
    Object.entries(this.args).forEach(([name, value]) => {
      if (name.includes('_')) {
        value = value === 'true' ? true : value;
        value = value === 'false' ? false : value;
        this.args[name.replace('_', '')] = value;
      }
    });
  }

  async execute(hre) {
    output.startCollectingOutput();

    if (this.scopeName) {
      debug.log(
        `Calling: ${this.scopeName} ${this.taskName} ${JSON.stringify(
          this.args,
          null,
          2
        )}`,
        'ai'
      );
      await hre.run({ scope: this.scopeName, task: this.taskName }, this.args);
    } else {
      debug.log(
        `Calling: ${this.taskName} ${JSON.stringify(this.args, null, 2)}`,
        'ai'
      );
      await hre.run(this.taskName, this.args);
    }

    return {
      tool_call_id: this.id,
      output: output.stopCollectingOutput(),
    };
  }

  getDescription() {
    const cliSyntax = this.toCliSyntax();
    const description = chalk.italic.dim(
      `${this.taskName}: "${this.task.description}"`
    );

    return `${cliSyntax}\n${description}`;
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
