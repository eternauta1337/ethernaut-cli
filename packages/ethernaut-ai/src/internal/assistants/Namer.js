const Assistant = require('./Assistant');

class Name extends Assistant {
  constructor(hre) {
    const config = require('./configs/namer.json');

    super('namer', config);
  }

  async process(thread) {
    await this.invalidateId();

    // Implement your logic here
  }
}

module.exports = Interpreter;
