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
 *       "hash": "<hash>",
 *     },
 *    "explainer": {
 *       "id": "<openai-id>",
 *       "hash": "<hash>",
 *     }
 *    "namer": {
 *       "id": "<openai-id>",
 *       "hash": "<hash>",
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

function assistantExists(id) {
  return fs.existsSync(path.join(getAssistantsPath(), `${id}.json`));
}

function readAssistant(id) {
  return JSON.parse(
    fs.readFileSync(path.join(getAssistantsPath(), `${id}.json`))
  );
}

function storeAssistant(id, data) {
  createFolderIfMissing(getAssistantsPath());
  createFileIfMissing(path.join(getAssistantsPath(), `${id}.json`), data);
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
};
