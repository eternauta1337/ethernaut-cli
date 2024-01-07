import { types } from "hardhat/config";
import { util } from "../scopes/util";

util
  .task("to-bytes", "Converts to bytes32")
  .addParam("value", "The value to convert", "hello", types.string)
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.encodeBytes32String(value);

    console.log(`"${value}" to bytes32 is <${result}>`);
  });
