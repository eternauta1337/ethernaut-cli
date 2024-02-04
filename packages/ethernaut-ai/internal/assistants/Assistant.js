const hashStr = require('common/hash-str');
const storage = require('../storage');
const openai = require('../openai');

class Assistant {
  constructor(name, config) {
    this.name = name;
    this.config = config;

    this.injectCommonInstructions();

    storage.init();
  }

  async process(thread) {
    await this.invalidateId();

    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: this.id,
    });

    return await this.processRun(thread, run);
  }

  async processRun(thread, run) {
    const { status, required_action } = await openai.beta.threads.runs.retrieve(
      thread.id,
      run.id
    );
    console.log('Running thread... status:', status);

    if (status === 'in_progress' || status === 'queued') {
      // Keep waiting and checking status...
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await this.processRun(thread, run);
    } else if (status === 'requires_action') {
      switch (required_action.type) {
        case 'submit_tool_outputs':
          // Hold execution until the required action is fulfilled.
          const outputs = await this.processToolCalls(
            required_action.submit_tool_outputs.tool_calls
          );
          if (!outputs) {
            await openai.beta.threads.runs.cancel(thread.id, run.id);
          } else {
            await openai.beta.threads.runs.submitToolOutputs(
              thread.id,
              run.id,
              {
                tool_outputs: outputs,
              }
            );
          }
          // Continue checking status...
          return await this.processRun(thread, run);
        default:
          console.log('Unknown action request type:', required_action.type);
      }
    } else if (status === 'completed') {
      return await thread.getLastAssistantResponse(run.id);
    } else if (status === 'cancelled') {
      return undefined;
    }
  }

  async processToolCalls(toolCalls) {
    throw new Error(
      'Not implemented. This method should be overridden by an assistant that knows how to handle tool calls.'
    );
  }

  async invalidateId() {
    if (this.needsUpdate()) {
      console.log('Updating assistant:', this.name);

      // Get the current id and delete the config file.
      const oldId = storage.getAssistantId(this.name);
      if (oldId) storage.deleteAssistantConfig(oldId);

      // Get a new id and store the new config file.
      const { id } = await openai.beta.assistants.create(this.config);
      storage.storeAssistantConfig(id, this.config);
      console.log('Created assistant:', id);

      // Store the info as well.
      storage.storeAssistantInfo(this.name, id);

      this.id = id;
    } else {
      this.id = storage.getAssistantId(this.name);
    }
  }

  needsUpdate() {
    const info = storage.readAssistantInfo(this.name);

    // No info for this name?
    if (!info) return true;

    // Or not enough info?
    if (!info.id) return true;

    // Is there a config file for this assistant?
    const oldConfig = storage.readAssistantConfig(info.id);
    if (!oldConfig) return true;

    // Compare the hash of the current config with the hash of the stored config
    const oldHash = hashStr(JSON.stringify(oldConfig));
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
