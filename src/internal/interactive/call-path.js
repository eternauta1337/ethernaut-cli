function getCommandCallPath(command) {
  if (command.parent) {
    return [...getCommandCallPath(command.parent), command._name];
  } else {
    return [];
  }
}

module.exports = {
  getCommandCallPath,
};
