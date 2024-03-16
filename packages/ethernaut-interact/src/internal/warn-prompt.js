const prompt = require('ethernaut-common/src/ui/prompt')
const output = require('ethernaut-common/src/ui/output')

module.exports = async function warnWithPrompt(message) {
  output.warn(message)
  const response = await prompt({
    type: 'confirm',
    message: 'Continue anyway?',
  })
  if (!response) process.exit(0)
}
