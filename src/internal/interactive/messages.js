const chalk = require('chalk');

function nameAndDescription(name, description) {
  return `${chalk.green(name)} - ${chalk.dim(
    ' ' + capDescription(description)
  )}`;
}

function capDescription(description) {
  const firstSentence = description.split('.')[0];
  return firstSentence.substring(0, 50);
}

module.exports = {
  nameAndDescription,
};
