const getBalance = require('./get-balance');
const output = require('common/output');

module.exports = async function printTxSummary({
  signer,
  to,
  value,
  description,
}) {
  output.resultBox(
    'Transaction Summary',
    [
      `${description}\n`,
      `Signer: ${signer.address}`,
      `Balance: ${await getBalance(signer.address)} ETH`,
      `To: ${to}`,
      `Value: ${value} ETH`,
    ],
    (borderStyle = 'single')
  );
};
