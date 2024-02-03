class Action {
  constructor(action) {
    this.parse(action);
  }

  // Converts an openai function call to a shell call.
  // E.g.
  // from: { name: 'to-bytes', arguments: '{"value":"poop", "_fix":"true"}' }
  // to: [ "to-bytes", "poop", "--fix", "true" ]
  parse(action) {
    this.tokens = [action.name];

    // Arguments and options are mixed,
    // but option names start with underscore.
    const argsAndOpts = JSON.parse(action.arguments);
    Object.entries(argsAndOpts).forEach(([name, value]) => {
      const isOption = name.includes('_');

      if (isOption) {
        name = name.substring(1); // Remove underscore
        this.tokens.push(`--${name}`);
      }

      this.tokens.push(`${value}`);
    });
  }

  async execute(hre) {
    let output = '';

    const originalLog = console.log;
    function log(...args) {
      output += args.join(' ');
      originalLog(...args);
    }

    console.log = log;

    const comps = this.tokens[0].split(':');
    if (comps.length === 1) {
      const task = comps[0];
      await hre.run(task, { value: 'SNX' });
    } else {
      const scope = comps[0];
      const task = comps[1];
      await hre.run({ scope, task }, { value: 'SNX' });
    }

    console.log = originalLog;

    return output;
  }

  toString() {
    const ts = this.tokens.concat();
    ts[0] = ts[0].replace(':', ' ');
    return ts.join(' ');
  }
}

module.exports = Action;
