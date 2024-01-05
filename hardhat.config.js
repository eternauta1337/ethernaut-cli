require('@nomicfoundation/hardhat-ethers');

module.exports = {
  solidity: '0.8.12',
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  paths: {
    sources: './src/contracts',
  },
};
