const storage = require('./storage');
const getNodes = require('common/get-nodes');
const crypto = require('crypto');
const openai = require('./openai');

let _hre;

async function updateAssistants(hre) {
  _hre = hre;

  const ids = storage.readIds();

  await updateAssistant('interpreter', ids);
  await updateAssistant('explainer', ids);
  await updateAssistant('namer', ids);
}

async function updateAssistant(name, ids) {
  const common = require('../assistants/common.json');

  let config;
  if (name === 'interpreter') config = buildInterpreterConfig(common);
  else if (name === 'explainer') config = buildExplainerConfig(common);
  else if (name === 'namer') config = buildNamerConfig(common);
  else throw new Error('Unknown assistant type:' + name);

  if (!assistantNeedsUpdate(name, ids, config)) return;
  console.log('Updating assistant:', name);

  // Update the assistant record
  const assistant = (ids.assistants[name] = {});
  assistant.id = await openai.createAssistant(config);

  storage.storeIds(ids);
  storage.storeAssistant(assistant.id, config);
}

function buildInterpreterConfig(common) {
  const config = require('../assistants/interpreter.json');

  injectCliExplanation(config, common);
  injectToolsSpec(config);

  return config;
}

function buildExplainerConfig(common) {
  const config = require('../assistants/explainer.json');

  injectCliExplanation(config, common);
  injectDocs(config);

  return config;
}

function injectDocs(config) {
  const tasks = flattenTasks(getNodes(_hre));

  const docs = [];
  tasks.forEach((t) => {
    let str = '';
    str += `task: "${t.name}"\n`;
    str += `  description: ${t._description}\n`;
    str += `  parameters: ${injectParameterDocs(t)}\n`;
    docs.push(str);
  });

  config.instructions = config.instructions.replace(
    '[task-docs]',
    docs.join('\n')
  );
}

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

function buildNamerConfig(common) {
  const config = require('../assistants/namer.json');

  injectCliExplanation(config, common);

  return config;
}

function injectToolsSpec(config) {
  const tasks = flattenTasks(getNodes(_hre));

  config.tools = [];

  tasks.forEach((t) => {
    config.tools.push({
      type: 'function',
      function: {
        name: t.name,
        description: t._description,
        parameters: collectParameterSpecs(t),
      },
    });
  });
}

function collectParameterSpecs(task) {
  const properties = {};
  const required = [];

  for (const param of task.positionalParamDefinitions) {
    properties[param.name] = {
      type: 'string',
      description: param.description,
    };
    if (!param.isOptional) {
      required.push(param.name);
    }
  }

  for (const param of Object.values(task.paramDefinitions)) {
    const name = `_${param.name}`;
    properties[name] = {
      type: 'string',
      description: param._description,
    };
    if (!param.isOptional) {
      required.push(name);
    }
  }

  return {
    type: 'object',
    properties,
    required,
  };
}

function flattenTasks(nodes) {
  return nodes.reduce((flatTasks, node) => {
    if (node.isScope) {
      return [...flatTasks, ...flattenTasks(Object.values(node.tasks))];
    } else {
      return [...flatTasks, node];
    }
  }, []);
}

function injectCliExplanation(config, common) {
  config.instructions = config.instructions.replace(
    '[cli-explanation]',
    common['cli-explanation']
  );
}

function assistantNeedsUpdate(name, ids, config) {
  // Inject empty props if mising
  if (!ids.assistants) ids.assistants = {};

  // Is the assistant for this name missing?
  if (!ids.assistants[name]) return true;

  // Or any of its properties missing?
  const assistant = ids.assistants[name];
  if (!assistant.id) return true;

  // Is the assistant file missing?
  if (!storage.assistantExists(assistant.id)) return true;

  // Is the assistant file outdated?
  const oldHash = hashStr(JSON.stringify(storage.readAssistant(assistant.id)));
  const newHash = hashStr(JSON.stringify(config));
  return newHash !== oldHash;
}

function hashStr(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = {
  updateAssistants,
};
