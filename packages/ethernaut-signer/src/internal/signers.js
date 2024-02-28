const storage = require('./storage')

async function setSigner(alias) {
  const signers = storage.readSigners()

  const signer = signers[alias]
  if (!signer) {
    throw new Error(`The signer ${alias} does not exist`)
  }

  signers.activeSigner = alias

  storage.storeSigners(signers)
}

function getWallet(pk) {
  return new hre.ethers.Wallet(pk, hre.ethers.provider)
}

async function getSigner(address) {
  const signers = storage.readSigners()

  const signer = signers.values.find((signer) => signer.address === address)
  if (!signer) {
    throw new Error(`The signer ${address} does not exist`)
  }

  return getWallet(signer.pk)
}

async function getSigners() {
  const signers = storage.readSigners()
  let activeSigner = signers.activeSigner
  let signersArr = _getSignersArray(signers)

  if (signersArr.length === 0 || !activeSigner) {
    return hre.ethers.getSignersOriginal()
  }

  activeSigner = signers[activeSigner].address

  signersArr = _sortSigners(signersArr, activeSigner)

  return signersArr.map((s) => getWallet(s.pk))
}

function _getSignersArray(signers) {
  const arr = []
  Object.values(signers).forEach((s) => {
    if (s.address) {
      arr.push(s)
    }
  })
  return arr
}

function _sortSigners(signers, firstAddress) {
  return signers.sort((a, b) => {
    if (a.address === firstAddress) {
      return -1
    }
    if (b.address === firstAddress) {
      return 1
    }
    return 0
  })
}

function modifySigners(hre) {
  hre.ethers.getSignerOriginal = hre.ethers.getSigner
  hre.ethers.getSignersOriginal = hre.ethers.getSigners
  hre.ethers.getSigners = getSigners
  hre.ethers.getSigner = getSigner
}

module.exports = {
  setSigner,
  getWallet,
  getSigner,
  getSigners,
  modifySigners,
}
