const fs = require('fs')

function createFolderIfMissing(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
  }
}

function createFileIfMissing(filePath, dataFn = () => {}) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(dataFn(), null, 2))
  }
}

module.exports = {
  createFolderIfMissing,
  createFileIfMissing,
}
