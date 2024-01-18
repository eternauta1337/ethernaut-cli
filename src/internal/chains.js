function getNetworkNameFromChainId(id) {
  switch (id) {
    case 1:
      return 'mainnet';
    case 11155111:
      return 'sepolia';
    default:
      return 'unknown';
  }
}

module.exports = {
  getNetworkNameFromChainId,
};
