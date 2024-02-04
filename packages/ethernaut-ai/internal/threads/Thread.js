const storage = require('../storage');
const openai = require('../openai');

class Thread {
  constructor(name = 'default') {
    this.name = name;

    storage.init();
  }

  async post(message) {
    await this.invalidateId();

    await openai.beta.threads.messages.create(this.id, {
      role: 'user',
      content: message,
    });
  }

  async stop() {
    await this.invalidateId();

    const runs = await openai.beta.threads.runs.list(this.id);
    if (!runs) return;

    const activeRuns = runs.body.data.filter(
      (run) =>
        run.status === 'in_progress' ||
        run.status === 'queued' ||
        run.status === 'requires_action'
    );
    if (!activeRuns || activeRuns.length === 0) return;

    console.log(`Stopping active runs: ${activeRuns.length}`);

    for (const run of activeRuns) {
      console.log(`Stopping ${run.id}`);
      await openai.beta.threads.runs.cancel(this.id, run.id);
    }
  }

  async getMessages() {
    return await openai.beta.threads.messages.list(this.id);
  }

  async getLastMessage(runId, role = 'assistant') {
    const messages = await this.getMessages();

    return messages.data
      .filter((message) => message.run_id === runId && message.role === role)
      .pop().content[0].text.value;
  }

  async invalidateId() {
    if (this.needsUpdate()) {
      console.log('Creating thread:', this.name);

      const { id } = await openai.beta.threads.create();
      storage.storeThreadInfo(this.name, id);

      this.id = id;
    } else {
      this.id = storage.getThreadId(this.name);
    }
  }

  needsUpdate() {
    // There is no "default" thread
    return storage.readThreadInfo(this.name) === undefined;
  }
}

module.exports = Thread;
