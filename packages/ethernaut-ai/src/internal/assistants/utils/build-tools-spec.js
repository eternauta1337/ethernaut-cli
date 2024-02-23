const getNodes = require('common/src/get-nodes')
const flattenTasks = require('common/src/flatten-tasks')

module.exports = function buildToolsSpec(hre) {
  const tasks = flattenTasks(getNodes(hre))

  const tools = []

  tasks.forEach((t) => {
    if (t.scope && t.scope === 'vars') return

    tools.push({
      type: 'function',
      function: {
        name: t.scope ? `${t.scope}.${t.name}` : t.name,
        description: t._description,
        parameters: collectParameterSpecs(t),
      },
    })
  })

  return tools
}

function collectParameterSpecs(task) {
  const properties = {}
  const required = []

  for (const param of task.positionalParamDefinitions) {
    properties[param.name] = {
      type: 'string',
      description: param.description,
    }
    if (!param.isOptional) {
      required.push(param.name)
    }
  }

  for (const param of Object.values(task.paramDefinitions)) {
    const name = `_${param.name}`
    properties[name] = {
      type: 'string',
      description: param.description,
    }
    if (!param.isOptional) {
      required.push(name)
    }
  }

  return {
    type: 'object',
    properties,
    required,
  }
}
