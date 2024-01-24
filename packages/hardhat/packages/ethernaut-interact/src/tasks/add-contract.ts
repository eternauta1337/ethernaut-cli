import { types } from "hardhat/config";
import { interact } from "../scopes/interact";

interact
  .task("add-contract", "Adds a contract to the registry")
  .addOptionalParam(
    "address",
    "The address of the contract",
    undefined,
    types.string
  )
  .addOptionalParam("name", "The name of the contract", undefined, types.string)
  .setAction(async ({ address, name }, hre) => {
    console.log(`Adding contract ${name} at ${address} to the registry`);
  });
