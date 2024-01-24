// TODO: Requires folder to be manually created in dist/src/data:
// - data/abis
// - data/addresses.json

import fs from "fs";
import path from "path";

const ADDRESSES_PATH = path.join(__dirname, "../data/addresses.json");
const ABIS_PATH = path.join(__dirname, "../data/abis");

async function storeAbi(name: string, abi: any) {
  const filePath = path.join(ABIS_PATH, `${name}.json`);

  console.log("Saving abi in", filePath);

  fs.writeFileSync(filePath, JSON.stringify(abi, null, 2));
}

function readAbi(name: string): any {
  const filePath = path.join(ABIS_PATH, `${name}.json`);
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

async function storeAddress(address: string, abiName: string, network: string) {
  console.log(
    `Saving address ${address} for contract "${abiName}" on ${network}`
  );

  let addresses = await readAddresses();

  // Push address
  if (!addresses.hasOwnProperty(network)) {
    addresses[network] = {};
  }
  if (!addresses[network].hasOwnProperty(abiName)) {
    addresses[network][abiName] = [];
  }
  if (!addresses[network][abiName].includes(address)) {
    addresses[network][abiName].push(address);
  }

  // Write back to file
  const updatedData = JSON.stringify(addresses, null, 2);
  fs.writeFileSync(ADDRESSES_PATH, updatedData);
}

async function readAddresses(): Promise<any> {
  const data = fs.readFileSync(ADDRESSES_PATH, "utf8");
  return JSON.parse(data);
}

export { storeAbi, readAbi, storeAddress, readAddresses };
