import { types } from "hardhat/config";
import { interact } from "../scopes/interact";
import EtherscanApi from "../internal/etherscan";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import {
  storeAbi,
  readAbi,
  storeAddress,
  readAddresses,
} from "../internal/store";
import { prompt } from "enquirer";

interact
  .task(
    "interact",
    "Interacts with a contract given its address and optional name"
  )
  .addOptionalParam(
    "address",
    "The address of the contract",
    undefined,
    types.string
  )
  .addOptionalParam("name", "The name of the contract", undefined, types.string)
  .setAction(async ({ name: contractName, address: contractAddress }, hre) => {
    const { name, address } = await pickNameAndAddress(
      contractName,
      contractAddress,
      hre
    );
    const abi = await readAbi(name!);
    const fnAbi = await pickFunction(abi);
    const args = await pickArgs(fnAbi);
    await callFunction(abi, address, fnAbi, args, hre);
  });

async function callFunction(abi, address, fnAbi, args, hre) {
  // TODO: Also support write calls
  const contract = await hre.ethers.getContractAt(abi, address);

  const response = await contract[fnAbi.name](...args);

  console.log("Response:", response);
}

async function pickArgs(fnAbi) {
  const args: string[] = [];

  for (let i = 0; i < fnAbi.inputs.length; i++) {
    const input = fnAbi.inputs[i];

    const response: any = await prompt({
      type: "input",
      name: "arg",
      message: `Enter a value for ${input.name} (${input.type})})`,
    });

    args.push(response.arg);
  }

  return args;
}

async function pickFunction(abi) {
  const functions = abi.filter((f) => f.type === "function");

  // TODO: Show full function signature here
  const response: any = await prompt({
    type: "select",
    name: "function",
    choices: functions.map((f) => f.name),
    message: "Pick a function",
  });

  const fn = functions.find((f) => f.name === response.function);

  return fn;
}

async function pickNameAndAddress(
  name: string | undefined,
  address: string | undefined,
  hre: HardhatRuntimeEnvironment
) {
  // TODO: Use this to figure out the forked network name
  // console.log(hre.network.config.chainId);
  const networkName = "sepolia";

  // Read addresses known for the active network
  const addresses = await readAddresses();
  const networkAddresses = addresses[networkName];

  // If no address or name is provided,
  // allow the user to pick one from the addresses.json file
  if (!address && !name) {
    const response: any = await prompt({
      type: "select",
      name: "contract",
      choices: Object.keys(networkAddresses),
      message: "Pick a contract",
    });

    name = response.contract;
    address = networkAddresses[name!].pop();
  }

  // If only a name is provided,
  // find the address in the addresses.json file
  if (name && !address) {
    if (!networkAddresses[name]) {
      throw new Error(
        `No address is known for ${name} on the ${networkName} network`
      );
    }

    address = networkAddresses[name].pop();
  }

  // If only an address is provided,
  // try to find the name in the addresses.json file
  if (address && !name) {
    for (const entry in networkAddresses) {
      if (networkAddresses[entry].includes(address)) {
        name = entry;
        break;
      }
    }
  }
  let tryEtherscan = !name || readAbi(name) === undefined;
  if (tryEtherscan) {
    console.log("Trying to find contract data on Etherscan...");
    const contractData = await findContractDataOnEtherscan(address!, hre);

    if (contractData) {
      console.log("Contract data found on Etherscan:", contractData.name);

      // Store the data for future use
      await storeAbi(contractData.name, contractData.abi);
      await storeAddress(address!, contractData.name, networkName);
    } else {
      console.log("Unable to find abi for interaction. Cannot continue");
      process.exit(0);
    }

    if (!name) {
      name = contractData!.name;
    }
  }

  return { name, address };
}

async function pickContract(
  name: string,
  address: string,
  hre: HardhatRuntimeEnvironment
) {
  // By now, name and address should be defined
  // so we can just grab the abi from the file
  return readAbi(name);
}

async function findContractDataOnEtherscan(
  address: string,
  hre: HardhatRuntimeEnvironment
): Promise<any | undefined> {
  // TODO: Fix this editor error
  const apiKey = hre.config.interact.etherscanApiKey;

  try {
    if (!apiKey) {
      throw new Error(
        "You must provide an Etherscan API key in your hardhat config"
      );
    }

    const client = new EtherscanApi(apiKey, "https://api-sepolia.etherscan.io");

    console.log("Fetching contract data from Etherscan...");
    const rawData = await client.getContractCode(address);

    return {
      name: rawData.ContractName,
      abi: rawData.ABI,
    };
  } catch (error) {
    console.log(
      `Unable to fetch contract data from Etherscan. Reason: ${error}`
    );
    return undefined;
  }
}
