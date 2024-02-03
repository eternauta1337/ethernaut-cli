const fs = require('fs');
const path = require('path');
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('common/create-file');

/**
 * Stores data like this:
 * <hardhat-project>/
 *   artifacts/
 *     ai/
 *       assistants/
 *         <openai-assistant-id>.json
 *       info.json
 *
 * info.json schema:
 * {
 *   assistants: [
 *     {
 *       name: "<assistant-name>",
 *       id: "<openai-assistant-id>"
 *     }
 *   ],
 *   threads: [
 *     {
 *       name: "<thread-name>",
 *       id: "<openai-thread-id>"
 *     }
 *   ]
 * }
 *
 * <assistant-name> schema:
 * {
 *   name: "...",
 *   description: "...",
 *   instructions: "...",
 *   tools: [...]
 * }
 */

// -------------------
// Threads
// -------------------

function storeThreadInfo(name, id) {
  const info = readInfo();

  const thread = info.threads.find((e) => e.name === name);

  if (thread) {
    thread.id = id;
  } else {
    info.threads.push({ name, id });
  }

  storeInfo(info);
}

function getThreadId(name) {
  return readThreadInfo(name)?.id;
}

function readThreadInfo(name) {
  const threads = readInfo().threads;
  return threads.find((e) => e.name === name);
}

// -------------------
// Assistants
// -------------------

function readAssistantConfig(id) {
  const filePath = getAssistantConfigPath(id);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function readAssistantInfo(name) {
  const assistants = readInfo().assistants;
  return assistants.find((e) => e.name === name);
}

function storeAssistantInfo(name, id) {
  const info = readInfo();

  const assistant = info.assistants.find((e) => e.name === name);

  if (assistant) {
    assistant.id = id;
  } else {
    info.assistants.push({ name, id });
  }

  storeInfo(info);
}

function storeAssistantConfig(id, data) {
  fs.writeFileSync(getAssistantConfigPath(id), JSON.stringify(data, null, 2));
}

function deleteAssistantConfig(id) {
  const filePath = getAssistantConfigPath(id);
  if (!fs.existsSync(filePath)) return;
  fs.unlinkSync(getAssistantConfigPath(id));
}

function getAssistantConfigPath(id) {
  return path.join(getAssistantsFolderPath(), `${id}.json`);
}

function getAssistantsFolderPath() {
  return path.join(getAiFolderPath(), 'assistants');
}

function getAssistantId(name) {
  return readAssistantInfo(name)?.id;
}

// -------------------
// General
// -------------------

function init() {
  createFolderIfMissing(getAiFolderPath());
  createFolderIfMissing(getAssistantsFolderPath());
  createFileIfMissing(getInfoFilePath(), {
    assistants: [],
    threads: [],
  });
}

function readInfo() {
  return JSON.parse(fs.readFileSync(getInfoFilePath(), 'utf8'));
}

function storeInfo(data) {
  fs.writeFileSync(getInfoFilePath(), JSON.stringify(data, null, 2));
}

function getAiFolderPath() {
  return path.join(process.cwd(), 'artifacts', 'ai');
}

function getInfoFilePath() {
  return path.join(getAiFolderPath(), 'info.json');
}

module.exports = {
  // General
  init,
  readInfo,
  storeInfo,
  // Threads
  readThreadInfo,
  storeThreadInfo,
  getThreadId,
  // Assistants
  readAssistantConfig,
  storeAssistantConfig,
  storeAssistantInfo,
  deleteAssistantConfig,
  readAssistantInfo,
  getAssistantId,
};
