function findRootCommand(command) {
  if (command.parent) {
    return findRootCommand(command.parent);
  }

  return command;
}

module.exports = {
  findRootCommand,
};
