const getBalance = require('./get-balance');
const output = require('common/output');

module.exports = async function printTxSummary({
  signer,
  to,
  value,
  description,
}) {
  output.warnBox(
    `${description}\n\n` +
      `Signer: ${signer.address}\n` +
      `Balance: ${await getBalance(signer.address)} ETH\n` +
      `To: ${to}\n` +
      `Value: ${value} ETH`,
    'Pending Tx'
  );
};
