const enquirer = require('enquirer')
const suggestDef = require('ethernaut-common/src/ui/suggest')
const spinner = require('ethernaut-common/src/ui/spinner')

let _promises = []
let _hidden = false

// Queues prompts and resolves them in order.
async function prompt({
  type,
  suggest,
  message,
  choices,
  limit,
  initial,
  callback,
  onPrompt,
  show = true,
}) {
  const promptFn = enquirer.prompt

  // This function returns a promise that resolves to the user's response.
  // This is convenient, unless you need to access the prompt object
  // used internally by enquirer. In that case, use the onPrompt callback.
  if (onPrompt) {
    promptFn.once('prompt', (prompt) => {
      onPrompt(prompt)
    })
  }

  // If there are other prompts in line,
  // wait for them to finish first.
  await Promise.all(_promises)

  // Spinners eat up the last line of output,
  // which prompts use. So they can't coexist.
  // Thus, this utility guarantees that spinners
  // always stop when a prompt is coming...
  spinner.stop()

  // Creating the promise but not resolving it allows us to
  // queue multiple prompts and resolve them in order.
  const promise = promptFn({
    type: type || 'input',
    name: 'response',
    message,
    choices,
    limit,
    suggest: suggest || suggestDef,
    initial,
    show: !_hidden && show,
  }).catch(() => {
    // ctrl-c exits the prompt, and another ctrl-c
    // is needed to exit the process, which is annoying.
    // So we exit the process if the prompt is aborted.
    process.exit(0)
  })

  // Now add the new promise to the queue
  // resolve it, and remove it from the queue.
  _promises.push(promise)
  const { response } = await promise
  _promises.pop()

  // And report
  if (callback) callback(response)
  return response
}

// Use this function to hide any enqueued prompts.
// May be wanted while some other terminal output
// needs to take precedence over prompts that may appear.
function hidePrompts(value) {
  _hidden = value
}

module.exports = {
  prompt,
  hidePrompts,
}
