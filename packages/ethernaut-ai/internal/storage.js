const fs = require('fs');
const path = require('path');
const {
  createFolderIfMissing,
  createFileIfMissing,
} = require('common/create-file');

/**
 * ids.json schema:
 * {
 *   "assistants": {
 *     "interpreter": {
 *       "id": "<openai-id>",
 *     },
 *    "explainer": {
 *       "id": "<openai-id>",
 *     }
 *    "namer": {
 *       "id": "<openai-id>",
 *     }
 *   }
     "threads": [
       {
         "name": "...";
         "id": "<openai-id>",
       }
     ]
 * }
 */

function readIds() {
  initStorage();

  return JSON.parse(fs.readFileSync(getIdsFilePath(), 'utf8'));
}

function storeIds(data) {
  initStorage();

  fs.writeFileSync(getIdsFilePath(), JSON.stringify(data, null, 2));
}

function getIdsFilePath() {
  return path.join(process.cwd(), 'artifacts', 'ai', 'ids.json');
}

function getAssistantsPath() {
  return path.join(process.cwd(), 'artifacts', 'ai', 'assistants');
}

function getAssistantPath(id) {
  return path.join(getAssistantsPath(), `${id}.json`);
}

function assistantExists(id) {
  return fs.existsSync(getAssistantPath(id));
}

function readAssistant(id) {
  return JSON.parse(fs.readFileSync(getAssistantPath(id)));
}

function storeAssistant(id, data) {
  createFolderIfMissing(getAssistantsPath());
  createFileIfMissing(getAssistantPath(id), data);
}

function deleteAssistant(id) {
  const filePath = getAssistantPath(id);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

function initStorage() {
  createFolderIfMissing(getAssistantsPath());
  createFolderIfMissing(path.join(process.cwd(), 'artifacts', 'ai', 'threads'));

  createFileIfMissing(getIdsFilePath(), {});
}

module.exports = {
  readIds,
  storeIds,
  getAssistantsPath,
  assistantExists,
  readAssistant,
  storeAssistant,
  deleteAssistant,
};
