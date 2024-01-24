const { Command } = require('commander');
const logger = require('../../internal/logger');
const { getProvider } = require('../../internal/get-provider');
const { validateBytes32 } = require('../../internal/validate');

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
