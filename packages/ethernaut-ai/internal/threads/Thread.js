const OpenAI = require('openai');
const Storage = require('../Storage');

class Thread {
  constructor() {
    this.name = 'default';

    this.storage = new Storage('threads');

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async post(message) {
    await this.invalidateId();
  }

  async invalidateId() {
    if (!this.needsUpdate()) return;

    console.log('Creating thread:', this.name);

    const { id } = await global.openai.beta.threads.create();
    this.storage.storeFile(this.name, id, {});
  }

  needsUpdate() {
    // Is there a file for this thread?
    const file = this.storage.getFilename();
    if (!file) return true;
  }
}

module.exports = Thread;
