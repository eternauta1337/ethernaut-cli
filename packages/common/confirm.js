const prompt = require('common/prompt');

module.exports = async function confirm(msg, skip, exit = true) {
  if (skip) return;

  const response = await prompt({
    type: 'confirm',
    message: 'Do you want to proceed with the call?',
  });

  if (!response && exit) process.exit(0);
};
