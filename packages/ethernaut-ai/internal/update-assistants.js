const storage = require('./storage');
const openai = require('./openai');
const hashStr = require('common/hash-str');
const buildInterpreterConfig = require('./create-assistants/build-interpreter-config');
const buildExplainerConfig = require('./create-assistants/build-explainer-config');
const buildNamerConfig = require('./create-assistants/build-namer-config');

async function updateAssistants(hre) {
  const ids = storage.readIds();

  const common = require('./create-assistants/configs/common.json');

  await updateAssistant('interpreter', ids, common, hre);
  await updateAssistant('explainer', ids, common, hre);
  await updateAssistant('namer', ids, common, hre);
}

async function updateAssistant(name, ids, common, hre) {
  let config;
  if (name === 'interpreter') config = buildInterpreterConfig(common, hre);
  else if (name === 'explainer') config = buildExplainerConfig(common, hre);
  else if (name === 'namer') config = buildNamerConfig(common);
  else throw new Error('Unknown assistant type:' + name);

  if (!assistantNeedsUpdate(name, ids, config)) return;
  console.log('Updating assistant:', name);

  // Delete the previous assistant
  let assistant = ids.assistants[name];
  if (assistant.id) storage.deleteAssistant(assistant.id);

  // Update the assistant record
  assistant = ids.assistants[name] = {};
  assistant.id = await openai.createAssistant(config);

  // Store it
  storage.storeIds(ids);
  storage.storeAssistant(assistant.id, config);
}

function assistantNeedsUpdate(name, ids, config) {
  // Inject empty props if missing
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

module.exports = {
  updateAssistants,
};
