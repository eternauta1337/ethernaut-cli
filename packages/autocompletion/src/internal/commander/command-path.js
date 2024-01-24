function getCommandPath(command) {
  if (command.parent) {
    return [...getCommandPath(command.parent), command.name()];
  } else {
    return [];
  }
}

module.exports = {
  getCommandPath,
};
