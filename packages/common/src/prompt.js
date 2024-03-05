const { prompt } = require('enquirer')
const suggestDef = require('common/src/enquirer-suggest')
const spinner = require('common/src/spinner')

module.exports = async function ({
  type,
  suggest,
  message,
  choices,
  limit,
  initial,
}) {
  // Spinners eat up the last line of output,
  // which prompts use. So they can't coexist.
  // Thus, this utility guarantees that spinners
  // always stop when a prompt is coming...
  spinner.stop()

  const { response } = await prompt({
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

  return response
}
