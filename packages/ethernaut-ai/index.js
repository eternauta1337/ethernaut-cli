const requireAll = require('common/require-all');
const { extendEnvironment } = require('hardhat/config');
const storage = require('./internal/storage');
const getNodes = require('common/get-nodes');

requireAll(__dirname, 'tasks');

let _hre;

extendEnvironment((hre) => {
  _hre = hre;

  updateAssistants();
});

function updateAssistants() {
  const ids = storage.readIds();

  updateAssistant('interpreter', ids);
  updateAssistant('explainer', ids);
  updateAssistant('namer', ids);
}

function updateAssistant(name, ids) {
  if (!assistantNeedsUpdate(name, ids)) return;

  const assistant = ids.assistants[name];

  const common = require('./assistants/common.json');

  let config;
  if (name === 'interpreter') config = buildInterpreterConfig(common);
  else if (name === 'explainer') config = buildExplainerConfig(common);
  else if (name === 'namer') config = buildNamerConfig(common);
  else throw new Error('Unknown assistant type:' + name);

  console.log(JSON.stringify(config, null, 2));

  // TODO: Store assistant
  // TODO: Store hash
}

function buildInterpreterConfig(common) {
  const config = require('./assistants/interpreter.json');

  injectCliExplanation(config, common);
  injectToolsSpec(config);

  return config;
}

function buildExplainerConfig(common) {
  const config = require('./assistants/explainer.json');

  injectCliExplanation(config, common);

  // TODO: Inject docs

  return config;
}

function buildNamerConfig(common) {
  const config = require('./assistants/namer.json');

  injectCliExplanation(config, common);

  return config;
}

function injectToolsSpec(config) {
  const tasks = flattenTasks(getNodes(_hre));
  console.log(tasks.map((t) => t.name));

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
  console.log(task);

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

function assistantNeedsUpdate(name, ids) {
  // Inject empty props if mising
  if (!ids.assistants) ids.assistants = {};

  // Is the assistant for this name missing?
  if (!ids.assistants[name]) return true;

  // Or any of its properties missing?
  const assistant = ids.assistants[name];
  if (!assistant.id) return true;
  if (!assistant.hash) return true;

  // Is the assistant file missing?
  if (!storage.assistantExists(assistant.id)) return true;

  // Is the assistant file outdated?
  const data = storage.readAssistant(id);
  const hash = JSON.stringify(data);
  return hash !== assistant.hash;
}
