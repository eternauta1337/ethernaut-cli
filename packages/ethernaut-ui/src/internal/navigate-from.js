const prompt = require('ethernaut-common/src/prompt')
const getNodes = require('ethernaut-common/src/get-nodes')
const chalk = require('chalk')

module.exports = async function navigateFrom(node, hre) {
  let children = getNodes(node).sort((a, b) => b.isScope - a.isScope)

  const exclude = [
    ...hre.config.ethernaut.ui.exclude.scopes,
    ...hre.config.ethernaut.ui.exclude.tasks,
  ]
  children = children.filter((node) => !exclude.includes(node.name))

  const choices = children.map((node) => {
    // Cap desciption to 1 sentence and 150 characters
    const description = node.description?.split('.')[0].substring(0, 150) || ''

    return {
      title: `${node.tasks ? `[${node.name}]` : node.name} ${chalk.dim(
        description,
      )}`,
      value: node.name, // Autocomplete search hits this
    }
  })

  // If on scope, show an option
  // to go to the root scope
  const upTitle = '↩ up'
  if (node.isScope && node !== hre) {
    choices.unshift({ title: upTitle, value: undefined })
  }

  const response = await prompt({
    type: 'autocomplete',
    message: 'Pick a task or scope',
    limit: 15,
    choices,
  })

  if (response === upTitle) {
    await navigateFrom(hre, hre)
  }

  const nextLocation = children.find((node) => response.includes(node.name))

  if (nextLocation.isScope) {
    await navigateFrom(nextLocation, hre)
  } else {
    await hre.run({ task: nextLocation.name, scope: nextLocation.scope })

    // When running a task from navigation
    // return to navigation after the task is done
    await navigateFrom(node, hre)
  }
}
