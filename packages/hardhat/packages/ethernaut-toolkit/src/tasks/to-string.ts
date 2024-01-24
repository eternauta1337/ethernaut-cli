import { types } from "hardhat/config";
import { tools } from "../scopes/tools";

tools
  .task("to-string", "Converts to string")
  .addParam("value", "The value to convert", "0x42", types.string)
  .setAction(async ({ value }, hre) => {
    const result = hre.ethers.toUtf8String(value);

    console.log(`${value} to string is <${result}>`);
  });
