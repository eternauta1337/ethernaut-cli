const getNodes = require('common/get-nodes');
const flattenTasks = require('common/flatten-tasks');

module.exports = function buildDocs(hre) {
  const tasks = flattenTasks(getNodes(hre));

  const docs = [];
  tasks.forEach((t) => {
    let str = '';
    str += `task: "${t.name}"\n`;
    str += `  description: ${t._description}\n`;
    str += `  parameters: ${injectParameterDocs(t)}\n`;
    docs.push(str);
  });

  return docs;
};

function injectParameterDocs(task) {
  let str = '\n';

  for (const param of task.positionalParamDefinitions) {
    str += `    "${param.name}"${param.isOptional ? ' (optional)' : ''} ${
      param.description
    }\n`;
  }

  for (const param of Object.values(task.paramDefinitions)) {
    str += `    "--${param.name}"${param.isOptional ? ' (optional)' : ''} ${
      param.description
    }\n`;
  }

  return str;
}
