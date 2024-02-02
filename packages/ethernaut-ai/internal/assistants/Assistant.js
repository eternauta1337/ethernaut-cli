const hashStr = require('common/hash-str');
const OpenAI = require('openai');
const Storage = require('../Storage');

class Assistant {
  constructor(name, config) {
    this.name = name;
    this.config = config;

    this.injectCommonInstructions();

    this.storage = new Storage('assistants');

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async invalidateId() {
    if (!this.needsUpdate()) return;

    console.log('Updating assistant:', this.name);

    const oldId = this.storage.getId();
    if (oldId) this.storage.deleteFile();

    const { id } = await this.openai.beta.assistants.create(this.config);
    this.storage.storeFile(this.name, id, this.config);
  }

  needsUpdate() {
    // Is there a file for this assistant?
    const file = this.storage.getFilename();
    if (!file) return true;

    // Compare the hash of the current config with the hash of the file
    const oldHash = hashStr(JSON.stringify(this.storage.readFile()));
    const newHash = hashStr(JSON.stringify(this.config));
    return newHash !== oldHash;
  }

  injectCommonInstructions() {
    const common = require('./configs/common.json');

    this.config.instructions = this.config.instructions.replace(
      '[common]',
      common['cli-explanation']
    );
  }
}

module.exports = Assistant;
