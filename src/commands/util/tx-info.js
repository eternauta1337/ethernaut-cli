const { Command } = require('commander');
const ethers = require('ethers');
const logger = require('../../utils/logger');
const { getProvider } = require('../../utils/get-provider');
const { validateBytes32 } = require('../../utils/validate');

const command = new Command();

command
  .name('tx-info')
  .description('Retrieves information about a transaction')
  .argument('<tx-hash>', 'Transaction hash')
  .action(async (txHash) => {
    if (!validateBytes32(txHash)) {
      logger.error('Invalid transaction hash');
      return;
    }

    const tx = await getProvider().getTransaction(txHash);

    logger.output(
      `Transaction info for ${txHash}: ${JSON.stringify(tx, null, 2)}:`
    );
  });

module.exports = command;
