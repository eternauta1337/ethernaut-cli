const getNodes = require('ethernaut-common/src/tasks/get-nodes')
const flattenTasks = require('ethernaut-common/src/tasks/flatten')

module.exports = function buildDocs(hre) {
  const docs = []

  const nodes = getNodes(hre)

  const scopes = nodes.filter((n) => n.isScope === true)
  scopes.forEach((s) => {
    let str = ''
    str += `scope: "${s.name}"\n`
    str += `  description: ${s._description}\n`
    docs.push(str)
  })

  const tasks = flattenTasks(nodes)
  tasks.forEach((t) => {
    let str = ''
    str += `task: "${t.scope ? `${t.scope} ${t.name}` : t.name}"\n`
    if (t.scope) str += `  scope: ${t.scope}\n`
    str += `  description: ${t._description}\n`
    str += `  parameters: ${injectParameterDocs(t)}\n`
    docs.push(str)
  })

  return docs
}

function injectParameterDocs(task) {
  let str = '\n'

  for (const param of task.positionalParamDefinitions) {
    str += `    "${param.name}"${param.isOptional ? ' (optional)' : ''} ${
      param.description
    }\n`
  }

  for (const param of Object.values(task.paramDefinitions)) {
    str += `    "--${param.name}"${param.isOptional ? ' (optional)' : ''} ${
      param.description
    }\n`
  }

  return str
}
