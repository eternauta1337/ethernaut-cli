const fs = require('fs');
const path = require('path');

function addCommands(dir, command) {
  const absoluteDir = path.resolve(__dirname, '../..', dir);
  const files = fs.readdirSync(absoluteDir);

  files.forEach((file) => {
    const filePath = path.join(absoluteDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a directory, require the index.js file and add it as a command
      const indexFilePath = path.join(filePath, 'index.js');
      let subCommand;
      if (fs.existsSync(indexFilePath)) {
        subCommand = require(indexFilePath);
        command.addCommand(subCommand);
      }

      // Then, recursively add subcommands
      addCommands(filePath, subCommand);
    } else if (path.extname(file) === '.js' && file !== 'index.js') {
      // If it's a JS file (and not the index.js file), require it and add it as a command
      const subCommand = require(filePath);
      command.addCommand(subCommand);
    }
  });
}

module.exports = {
  addCommands,
};
