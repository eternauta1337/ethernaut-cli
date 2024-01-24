const ethers = require('ethers');

async function getSelectors(abi) {
  const contract = await new ethers.Contract(
    '0x0000000000000000000000000000000000000001',
    abi
  );

  return contract.interface.fragments.reduce((selectors, fragment) => {
    if (fragment.type === 'function') {
      selectors.push({
        name: fragment.name,
        selector: contract.interface.getSighash(fragment),
      });
    }

    return selectors;
  }, []);
}

module.exports = getSelectors;
