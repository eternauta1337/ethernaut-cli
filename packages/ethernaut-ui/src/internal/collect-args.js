const debug = require('common/src/debug')
const prompt = require('common/src/prompt')

let _hre

module.exports = async function collectArguments(providedArgs, task, hre) {
  _hre = hre

  // Merge all of the task's parameter definitions in the same array,
  // combining positional and named parameters.
  const paramDefinitions = task.positionalParamDefinitions.concat(
    Object.values(task.paramDefinitions),
  )

  const collectedArgs = {}
  for (let paramDef of paramDefinitions) {
    // TODO: Handle flags
    // if (paramDef.isFlag) continue;

    const providedArg = providedArgs[paramDef.name]

    const argsSoFar = { ...providedArgs, ...collectedArgs }

    collectedArg = await collectArg(paramDef, providedArg, argsSoFar)
    if (collectedArg !== undefined) {
      debug.log(
        `Autocompletion for "${paramDef.name}" collected "${collectedArg}"`,
        'ui',
      )

      collectedArgs[paramDef.name] = collectedArg
    }
  }

  return collectedArgs
}

async function collectArg(paramDef, providedArg, argsSoFar) {
  debug.log(
    `Collecting parameter "${paramDef.name}" - Provided: ${providedArg}"`,
    'ui',
  )

  let collectedArg

  // Does the parameter provide its own autocomplete function?
  if (paramDef.autocomplete) {
    collectedArg = await autocomplete(paramDef, argsSoFar)
  }

  // Mmnope, ok. Ask the user to input the parameter in raw text
  if (collectedArg === undefined && providedArg === undefined)
    collectedArg = await rawPrompt(paramDef)

  return collectedArg
}

async function autocomplete(paramDef, argsSoFar) {
  debug.log(`Running autocompletion for "${paramDef.name}"`, 'ui')

  const collectedArg = await paramDef.autocomplete({
    hre: _hre,
    name: paramDef.name,
    description: paramDef.description,
    ...argsSoFar,
  })

  return collectedArg
}

async function rawPrompt(param) {
  const description = param.description
    ? ` (${param.description.split('.')[0].substring(0, 150)})`
    : ''

  return await prompt({
    type: 'input',
    message: `Enter ${param.name}${description}:`,
    initial: param.defaultValue,
  })
}
