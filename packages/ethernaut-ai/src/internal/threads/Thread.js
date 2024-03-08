const storage = require('../storage')
const openai = require('../openai')

class Thread {
  constructor(name = 'default', newThread) {
    this.name = name

    if (newThread) {
      storage.clearThreadInfo(name)
    }
  }

  async post(message) {
    await this.invalidateId()

    await openai().beta.threads.messages.create(this.id, {
      role: 'user',
      content: message,
    })
  }

  async stop() {
    await this.invalidateId()

    const runs = await openai().beta.threads.runs.list(this.id)
    if (!runs) return

    const activeRuns = runs.body.data.filter(
      (run) =>
        run.status === 'in_progress' ||
        run.status === 'queued' ||
        run.status === 'requires_action',
    )
    if (!activeRuns || activeRuns.length === 0) return

    for (const run of activeRuns) {
      await openai().beta.threads.runs.cancel(this.id, run.id)
    }
  }

  async getMessages() {
    return await openai().beta.threads.messages.list(this.id)
  }

  async getLastMessage(runId, role = 'assistant') {
    const messages = await this.getMessages()

    let msgs = messages.data

    if (runId && role === 'assistant') {
      msgs = msgs.filter(
        (message) => message.run_id === runId && message.role === 'assistant',
      )
    }

    if (msgs.length === 0) {
      throw new Error('No message found')
    }

    const msg = msgs.sort((a, b) => b.created_at - a.created_at)[0]

    return msg.content[0].text.value
  }

  async invalidateId() {
    if (this.needsUpdate()) {
      const { id } = await openai().beta.threads.create()

      storage.storeThreadInfo(this.name, id)

      this.id = id
    } else {
      this.id = storage.getThreadId(this.name)
    }
  }

  needsUpdate() {
    return storage.readThreadInfo(this.name) === undefined
  }
}

module.exports = Thread
