module.exports = function getNetwork(hre) {
  return hre.network.config.name || hre.network.name
}
