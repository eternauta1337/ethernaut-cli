const hashStr = require('common/src/hash-str')
const storage = require('../storage')
const openai = require('../openai')
const debug = require('common/src/debug')
const EventEmitter = require('events')

class Assistant extends EventEmitter {
  constructor(name, config) {
    super()

    this.name = name
    this.config = config
    this.prevStatus = undefined

    this.injectCommonInstructions()

    storage.init()
  }

  async process(thread) {
    await this.invalidateId()

    this.thread = thread

    this.run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: this.id,
    })

    return await this.processRun()
  }

  async processRun() {
    const runInfo = await openai.beta.threads.runs.retrieve(
      this.thread.id,
      this.run.id,
    )

    const { status } = runInfo

    if (status === this.prevStatus) {
      return await this.waitAndProcessRun()
    }

    debug.log(
      `Checking status: ${status} (prev ${this.prevStatus}) - ${this.run.id}`,
      'ai',
    )

    this.emit('status_update', status)

    // Successful exit
    if (status === 'completed') {
      return await this.thread.getLastMessage(this.run.id)
    }

    // Bad exit
    if (status === 'cancelled' || status === 'failed') {
      return undefined
    }

    // Action
    if (status === 'requires_action') {
      const { required_action } = runInfo

      switch (required_action.type) {
        case 'submit_tool_outputs':
          if (this.prevStatus !== 'requires_action') {
            debug.log(`Emitting tool_calls_required event`, 'ai')
            this.emit(
              'tool_calls_required',
              required_action.submit_tool_outputs.tool_calls,
            )
          }
          break
        default:
          throw new Error(
            `Unknown action request type: ${required_action.type}`,
          )
          break
      }
    }

    this.prevStatus = status

    return await this.waitAndProcessRun()
  }

  async waitAndProcessRun() {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return await this.processRun()
  }

  async reportToolOutputs(outputs) {
    debug.log(`Reporting output: ${JSON.stringify(outputs)}`, 'ai-deep')

    if (!outputs) {
      await openai.beta.threads.runs.cancel(this.thread.id, this.run.id)
    } else {
      debug.log(`Outputs reported: ${outputs.length}`, 'ai')
      await openai.beta.threads.runs.submitToolOutputs(
        this.thread.id,
        this.run.id,
        {
          tool_outputs: outputs,
        },
      )
    }
  }

  async invalidateId() {
    if (this.needsUpdate()) {
      this.emit('building_assistant')

      // Get the current id and delete the config file.
      const oldId = storage.getAssistantId(this.name)
      if (oldId) storage.deleteAssistantConfig(oldId)

      // Get a new id and store the new config file.
      const { id } = await openai.beta.assistants.create(this.config)
      storage.storeAssistantConfig(id, this.config)

      // Store the info as well.
      storage.storeAssistantInfo(this.name, id)

      this.id = id
    } else {
      this.id = storage.getAssistantId(this.name)
    }
  }

  needsUpdate() {
    const info = storage.readAssistantInfo(this.name)

    // No info for this name?
    if (!info) return true

    // Or not enough info?
    if (!info.id) return true

    // Is there a config file for this assistant?
    const oldConfig = storage.readAssistantConfig(info.id)
    if (!oldConfig) return true

    // Compare the hash of the current config with the hash of the stored config
    const oldHash = hashStr(JSON.stringify(oldConfig))
    const newHash = hashStr(JSON.stringify(this.config))
    return newHash !== oldHash
  }

  injectCommonInstructions() {
    const common = require('./configs/common.json')

    this.injectInstructions(common['cli-explanation'], 'common')
  }

  injectAdditionalInstructions(additionalInstructions) {
    if (!additionalInstructions || additionalInstructions.length === 0) return

    const combined = additionalInstructions.join('. ')

    this.injectInstructions(combined, 'additional')
  }

  injectInstructions(text, tag) {
    this.config.instructions = this.config.instructions.replace(
      `[${tag}]`,
      text,
    )
  }
}

module.exports = Assistant
