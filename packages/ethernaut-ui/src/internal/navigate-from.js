const { prompt } = require('ethernaut-common/src/ui/prompt')
const getNodes = require('ethernaut-common/src/tasks/get-nodes')
const chalk = require('chalk')

module.exports = async function navigateFrom(node, hre) {
  let children = getNodes(node).sort((a, b) => b.isScope - a.isScope)

  const exclude = hre.config.ethernaut.ui.exclude
  children = children.filter((node) => {
    if (node.isScope) {
      return !exclude.includes(`${node.name}/*`)
    }

    const subnode = node.parentTaskDefinition || node

    if (subnode._scope) {
      return !exclude.includes(`${subnode._scope}/${subnode._task}`)
    }

    return !exclude.includes(subnode._task)
  })

  const choices = children.map((node) => {
    // Cap description to 1 sentence and 150 characters
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
    message: node.isScope
      ? `Pick a task [${node.name}]`
      : 'Pick a task or poop',
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
