async function getLatestRound() {
  // TODO, get latest from api
  return 3
}

async function getRoundNumber(round) {
  if (round === 'latest') {
    return getLatestRound()
  }

  return round
}

module.exports = {
  getLatestRound,
  getRoundNumber,
}
