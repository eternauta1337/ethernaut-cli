class TaskCall {
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
    // Hijack console.log so that it can be collected.
    let output = '';
    const originalLog = console.log;
    function log(...args) {
      output += args.join(' ');
      originalLog(...args);
    }
    console.log = log;

    // Prepare args
    let args = JSON.parse(this.function.arguments);
    Object.entries(args).forEach(([name, value]) => {
      value = value.replace('_', '');
    });

    // Execute
    const nameComponents = this.function.name.split('.');
    if (nameComponents.length === 1) {
      const task = nameComponents[0];
      await hre.run(task, args);
    } else {
      const scope = nameComponents[0];
      const task = nameComponents[1];
      await hre.run({ scope, task }, args);
    }

    // Release console.log
    console.log = originalLog;

    return {
      tool_call_id: this.id,
      output,
    };
  }

  toCliSyntax() {
    const tokens = [this.function.name.replace('.', ' ')];

    // Arguments and options are mixed,
    // but option names start with underscore.
    const argsAndOpts = JSON.parse(this.function.arguments);
    Object.entries(argsAndOpts).forEach(([name, value]) => {
      const isOption = name.includes('_');

      if (isOption) {
        name = name.substring(1); // Remove underscore
        this.tokens.push(`--${name}`);
      }

      tokens.push(`${value}`);
    });

    return tokens.join(' ');
  }
}

module.exports = TaskCall;
