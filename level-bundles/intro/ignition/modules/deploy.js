const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

module.exports = buildModule('OZBundle', (m) => {
  const instance = m.contract('InstanceFactory', []);

  return { instance };
});
