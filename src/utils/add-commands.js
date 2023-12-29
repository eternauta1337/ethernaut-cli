const fs = require('fs');
const path = require('path');

module.exports = function addCommands(dir, command) {
  const absoluteDir = path.resolve(__dirname, '..', dir);
  const files = fs.readdirSync(absoluteDir);
  const jsFiles = files.filter((file) => path.extname(file) === '.js');

  jsFiles.forEach((file) => {
    const filePath = path.join(absoluteDir, file);
    const subCommand = require(filePath);
    command.addCommand(subCommand);
  });
};
