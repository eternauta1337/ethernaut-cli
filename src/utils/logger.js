const chalk = require('chalk');
const { copyToClipboard } = require('./copy-to-clipboard');

function output(msg) {
  const regex = /<(.+?)>/;
  const match = msg.match(regex);

  if (match) {
    const specialMsg = match[1];
    copyToClipboard(specialMsg);
    msg = msg.replace(regex, chalk.green.bold(specialMsg));
  }

  console.log('✅', msg);
}

function info(msg) {
  console.log(chalk.gray(msg));
}

module.exports = {
  output,
  info,
};
