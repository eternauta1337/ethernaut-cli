const fs = require('fs');
const path = require('path');
const { createFolderIfMissing } = require('common/create-file');

/**
 * Stores data like this:
 * - hardhat project
 *   - artifacts
 *     - ai
 *       - <folder-name>
 *           <file-name>.<openai-id>.json
 *           <file-name>.<openai-id>.json
 *           <file-name>.<openai-id>.json
 */

class Storage {
  constructor(folderName) {
    this.folderName = folderName;
  }

  getFilename() {
    const folderPath = this.getFolderPath();
    createFolderIfMissing(folderPath);

    const filenames = fs
      .readdirSync(folderPath)
      .filter((file) => fs.lstatSync(path.join(folderPath, file)).isFile());

    return filenames.find((f) => f.includes(this.name));
  }

  getId() {
    const file = this.getFilename();
    if (!file) return;

    const comps = file.split('.');
    const id = comps[1];

    return id;
  }

  readFile() {
    const file = this.getFilename();
    const data = fs.readFileSync(path.join(this.getFolderPath(), file), 'utf8');
    return JSON.parse(data);
  }

  storeFile(name, id, data) {
    const filePath = path.join(this.getFolderPath(), `${name}.${id}.json`);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  deleteFile() {
    const file = this.getFilename();
    if (file) {
      fs.unlinkSync(path.join(this.getFolderPath(), file));
    }
  }

  getFolderPath() {
    return path.join(process.cwd(), 'artifacts', 'ai', this.folderName);
  }
}

module.exports = Storage;
