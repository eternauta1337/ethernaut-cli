const fs = require('fs')
const path = require('path')

module.exports = function requireAll(location, folder) {
  const folderPath = path.join(location, folder)
  fs.readdirSync(folderPath).forEach((file) => {
    const filePath = path.join(location, folder, file)
    require(filePath)
  })
}
