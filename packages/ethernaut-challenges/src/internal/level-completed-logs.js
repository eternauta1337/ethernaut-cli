const spinner = require('common/spinner');

module.exports = async function findLevelCompletedEvents(
  ethernaut,
  playerAddress,
  levelAddress
) {
  if (playerAddress === undefined) {
    throw new Error('Player address is required');
  }

  if (levelAddress === undefined) {
    throw new Error('Level address is required');
  }

  spinner.progress('Querying LevelCompletedLog events', 'check');

  const fromBlock = 0;
  const toBlock = 'latest'; // Fetch up to the most recent block

  const filter = ethernaut.filters.LevelCompletedLog(
    playerAddress,
    undefined,
    levelAddress
  );

  const events = await ethernaut.queryFilter(filter, fromBlock, toBlock);

  spinner.success('Queried LevelCompletedLog events', 'check');

  return events;
};
