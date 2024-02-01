const fs = require('fs');

function createFolderIfMissing(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
}

function createFileIfMissing(filePath, data = {}) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }
}

module.exports = {
  createFolderIfMissing,
  createFileIfMissing,
};
