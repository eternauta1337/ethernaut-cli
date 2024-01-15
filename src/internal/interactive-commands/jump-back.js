async function jumpBack(command) {
  if (command.parent) {
    await command.parent.parseAsync(['node', command.parent.name(), '-i']);
  } else {
    throw new Error('Cannot jump back from root command');
  }
}

module.exports = {
  jumpBack,
};
