const Agora = require('../internal/agora/Agora')
const { getLatestRound } = require('../internal/agora/utils/rounds')

async function getProjects(round) {
  const agora = new Agora()

  if (round === 'any') {
    return await agora.retro.projects()
  }

  if (round === 'latest') {
    return await agora.retro.roundProjects({
      roundId: await getLatestRound(),
    })
  }

  return await agora.retro.roundProjects({ roundId: round })
}

module.exports = {
  getProjects,
}
