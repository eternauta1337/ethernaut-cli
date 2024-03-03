const { types } = require('hardhat/config')
const Interpreter = require('../internal/assistants/Interpreter')
const Explainer = require('../internal/assistants/Explainer')
const Thread = require('../internal/threads/Thread')
const output = require('common/src/output')
const debug = require('common/src/debug')
const spinner = require('common/src/spinner')
const prompt = require('common/src/prompt')
const checkEnvVar = require('common/src/check-env')

let _noConfirm
let _thread
let _interpreter
let _explainer
let _query

require('../scopes/ai')
  .task('interpret', 'Interprets natural language into CLI commands')
  .addPositionalParam(
    'query',
    'The natural language query to convert to CLI commands',
    undefined,
    types.string,
  )
  .addOptionalParam(
    'model',
    'The model to use',
    'assistant-defined',
    types.string,
  )
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
      model = model === 'assistant-defined' ? undefined : model
      const response = await _interpreter.process(_thread, model)

      spinner.success('Assistant done', 'ai')

      if (response) {
        return output.resultBox(response, 'Assistant response')
      }
    } catch (err) {
      return output.errorBox(err)
    }
  })

async function processActions(actions, actionDescriptions) {
  debug.log(`Calls required: ${actionDescriptions}`, 'ai')

  output.copyBox(actionDescriptions.join('\n'), 'Suggested Actions')

  const outputs = []
  switch (await promptUser()) {
    case 'execute':
      spinner.progress('Executing...', 'ai')
      for (let action of actions) {
        // TODO: Not sure why this might be needed...
        await new Promise((resolve) => setTimeout(resolve, 1000))

        outputs.push(await action.execute(hre, _noConfirm))
      }
      spinner.progress('Analyzing...', 'ai')
      await _interpreter.reportToolOutputs(outputs)
      break
    case 'explain':
      spinner.progress('Analyzing...', 'ai')
      output.infoBox(
        await _explainer.explain(_query, actionDescriptions),
        'Explanation',
      )
      processActions(actions, actionDescriptions)
      break
    case 'skip':
      spinner.progress('Exiting...', 'ai')
      await _interpreter.reportToolOutputs(undefined)
      break
  }
}

async function promptUser() {
  if (_noConfirm) return 'execute'

  return await prompt({
    type: 'select',
    message: 'How would you like to proceed?',
    choices: ['execute', 'explain', 'skip'],
  })
}
