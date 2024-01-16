function flattenCommands(commands) {
  return commands.reduce((acc, command) => {
    if (command.commands.length > 0) {
      return [...acc, command, ...flattenCommands(command.commands)];
    } else {
      return [...acc, command];
    }
  }, []);
}

module.exports = {
  flattenCommands,
};
