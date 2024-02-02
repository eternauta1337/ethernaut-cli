const fs = require('fs');
const path = require('path');
const hashStr = require('common/hash-str');
const { createFolderIfMissing } = require('common/create-file');
const OpenAI = require('openai');

class Assistant {
  constructor(name, config) {
    this.name = name;
    this.config = config;

    this.injectCommonInstructions();

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async invalidateId() {
    if (this.needsUpdate()) {
      console.log('Updating assistant:', this.name);

      const oldId = this.getId();
      if (oldId) this.deleteFile();

      const { id } = await this.openai.beta.assistants.create(this.config);
      this.storeFile(id);
    }

    return this.getId();
  }

  needsUpdate() {
    // Is there a file for this assistant?
    const file = this.getFile();
    if (!file) return true;

    // Compare the hash of the current config with the hash of the file
    const oldHash = hashStr(JSON.stringify(this.readFile()));
    const newHash = hashStr(JSON.stringify(this.config));
    return newHash !== oldHash;
  }

  injectCommonInstructions() {
    const common = require('./configs/common.json');

    this.config.instructions = this.config.instructions.replace(
      '[common]',
      common['cli-explanation']
    );
  }

  // --------------------
  // Storage
  // --------------------

  /**
   * Assistants are stored like this:
   * - hardhat project
   *   - artifacts
   *     - ai
   *     - assistants
   *         <name>.<openai-id>.json
   *         <name>.<openai-id>.json
   *         <name>.<openai-id>.json

   * And each assistant file contains the openai config:
   * {
   *   "name": "...",
   *   "description": "...",
   *   "instructions": "...",
   *   "tools": []
   * }
   */

  getFile() {
    const folderPath = this.getAssistantsFolderPath();
    createFolderIfMissing(folderPath);

    const filenames = fs
      .readdirSync(folderPath)
      .filter((file) => fs.lstatSync(path.join(folderPath, file)).isFile());

    return filenames.find((f) => f.includes(this.name));
  }

  getId() {
    const file = this.getFile();
    if (!file) return;

    const comps = file.split('.');
    const id = comps[1];

    return id;
  }

  readFile() {
    const file = this.getFile();
    const data = fs.readFileSync(
      path.join(this.getAssistantsFolderPath(), file),
      'utf8'
    );
    return JSON.parse(data);
  }

  storeFile(id) {
    const filePath = path.join(
      this.getAssistantsFolderPath(),
      `${this.name}.${id}.json`
    );

    fs.writeFileSync(filePath, JSON.stringify(this.config, null, 2));
  }

  deleteFile() {
    const file = this.getFile();
    if (file) {
      fs.unlinkSync(path.join(this.getAssistantsFolderPath(), file));
    }
  }

  getAssistantsFolderPath() {
    return path.join(process.cwd(), 'artifacts', 'ai', 'assistants');
  }
}

module.exports = Assistant;
