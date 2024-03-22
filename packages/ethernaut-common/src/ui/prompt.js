const enquirer = require('enquirer')
const suggestDef = require('ethernaut-common/src/ui/suggest')
const spinner = require('ethernaut-common/src/ui/spinner')

// let _prompt
let _promises = []
let _onCancel

async function prompt({
  type,
  suggest,
  message,
  choices,
  limit,
  initial,
  callback,
}) {
  // Allows prompts to be generated with sync code,
  // and this fn will still be able to present them asynchronously
  await waitInLine()

  // Spinners eat up the last line of output,
  // which prompts use. So they can't coexist.
  // Thus, this utility guarantees that spinners
  // always stop when a prompt is coming...
  spinner.stop()

  const promptFn = enquirer.prompt
  // Uncomment the code below if the
  // prompt object is needed
  // promptFn.on('prompt', (prompt) => {
  //   _prompt = prompt
  // })

  const promise = promptFn({
    type: type || 'input',
    name: 'response',
    message,
    choices,
    limit,
    suggest: suggest || suggestDef,
    initial,
  }).catch(() => {
    // ctrl-c exits the prompt, and another ctrl-c
    // is needed to exit the process, which is annoying.
    // So we exit the process if the prompt is aborted.
    process.exit(0)
  })

  _promises.push(promise)

  const { response } = await promise
  _promises.pop()

  if (callback) {
    callback(response)
  }

  return response
}

async function waitInLine() {
  return new Promise((resolve) => {
    let id

    function check() {
      if (_onCancel) return false

      if (_promises.length === 0) {
        clearInterval(id)
        resolve(true)

        return true
      }

      return false
    }

    const checked = check()
    if (!checked) {
      id = setInterval(check, 1000)
    }
  })
}

function cancelAllPrompts() {
  _promises.forEach((promise) => {
    promise.cancel()
  })
  _promises = []
  _onCancel = true
}

module.exports = {
  prompt,
  cancelAllPrompts,
}
