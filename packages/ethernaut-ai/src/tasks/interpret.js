const types = require('ethernaut-common/src/validation/types')
const Interpreter = require('../internal/assistants/Interpreter')
const Explainer = require('../internal/assistants/Explainer')
const Thread = require('../internal/threads/Thread')
const output = require('ethernaut-common/src/ui/output')
const debug = require('ethernaut-common/src/ui/debug')
const spinner = require('ethernaut-common/src/ui/spinner')
const prompt = require('ethernaut-common/src/ui/prompt')
const { checkEnvVar } = require('ethernaut-common/src/io/env')
const wait = require('ethernaut-common/src/util/wait')

let _noConfirm
let _thread
let _interpreter
let _explainer
let _query

const options = {
  EXECUTE: 'execute',
  EDIT: 'edit',
  EXPLAIN: 'explain',
  SKIP: 'skip',
}

const TIMEOUT = 600000

require('../scopes/ai')
  .task('interpret', 'Interprets natural language into CLI commands')
  .addPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string,
  )
  .addOptionalParam('model', 'The model to use', undefined, types.string)
  .addFlag('noConfirm', 'Always execute the command without prompting')
  .addFlag('newThread', 'Start a new thread')
  .setAction(async ({ query, newThread, noConfirm, model }, hre) => {
    try {
      await checkEnvVar(
        'OPENAI_API_KEY',
        'This is required by the ai package to interact with the openai assistants API.',
      )

      _noConfirm = noConfirm
      _query = query

      spinner.progress('Preparing thread...', 'ai')
      _thread = new Thread('default', newThread)
      await _thread.stop()

      spinner.progress('Posting query...', 'ai')
      await _thread.post(query)

      const statusUpdateListener = (status) =>
        spinner.progress(`Thinking... (${status})`, 'ai')
      const buildingAssistantLIstener = () =>
        spinner.progress('Building assistant...', 'ai')

      _interpreter = new Interpreter(hre)
      _interpreter.on('status_update', statusUpdateListener)
      _interpreter.on('building_assistant', buildingAssistantLIstener)
      _interpreter.on('actions_required', processActions)

      _explainer = new Explainer(hre)
      _explainer.on('status_update', statusUpdateListener)
      _explainer.on('building_assistant', buildingAssistantLIstener)

      spinner.progress('Thinking...', 'ai')
      const waitPromise = wait(TIMEOUT)
      const response = await Promise.race([
        _interpreter.process(_thread, model),
        waitPromise,
      ])

      spinner.success('Assistant done', 'ai')

      if (response) {
        return output.resultBox(response, 'Assistant response')
      } else {
        throw new Error('Something went wrong with the query')
      }
    } catch (err) {
      return output.errorBox(err)
    }
  })

function printActionSummary(actions) {
  let strs = []

  actions
    .map((action) => action.getShortDescription())
    .forEach((desc, idx) => {
      strs.push(`${idx + 1}. ${desc}`)
    })

  const msg = strs.join('\n')

  output.infoBox(msg, 'Suggested action summary')
}

async function processActions(actions) {
  printActionSummary(actions)

  const outputs = []

  let i = 0
  while (i < actions.length) {
    const action = actions[i]

    output.infoBox(
      action.getDescription(),
      `Action ${i + 1} of ${actions.length}`,
    )

    switch (await promptUser()) {
      case options.EXECUTE:
        spinner.progress('Executing...', 'ai')
        // TODO: Not sure why this might be needed...
        await new Promise((resolve) => setTimeout(resolve, 1000))
        outputs.push(await action.execute(hre, _noConfirm))
        spinner.progress('Analyzing...', 'ai')
        i++
        break
      case options.EDIT:
        await edit(action)
        break
      case options.EXPLAIN:
        spinner.progress('Analyzing...', 'ai')
        await explain(action)
        break
      case options.SKIP:
        spinner.progress('Skipping...', 'ai')
        outputs.push({
          tool_call_id: action.id,
          output: 'User skipped execution',
        })
        i++
        break
    }
  }
  debug.log(`Reporting tool outputs: ${outputs}`, 'ai')
  await _interpreter.reportToolOutputs(outputs)
}

async function edit(action) {
  output.info(`Editing action: "${action.getShortDescription()}"`)

  for (let argName in action.args) {
    const arg = action.args[argName]
    const value = await prompt({
      type: 'input',
      message: `Enter new value for ${argName}:`,
      initial: arg,
    })
    action.args[argName] = value
  }
}

async function explain(action) {
  const waitPromise = wait(TIMEOUT)
  const response = await Promise.race([
    await _explainer.explain(_query, action.getShortDescription()),
    waitPromise,
  ])
  if (response) {
    output.infoBox(response, 'Explanation')
  } else {
    throw new Error('No response from assistant')
  }
}

async function promptUser() {
  if (_noConfirm) return 'execute'

  return await prompt({
    type: 'select',
    message: 'How would you like to proceed?',
    choices: Object.values(options),
  })
}
