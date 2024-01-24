import { types } from "hardhat/config";
import { tools } from "../scopes/tools";

tools
  .task("units", "Converts between ether units")
  .addParam("amount", "The amount to convert", 0, types.int)
  .addParam("from", "The unit to convert from", "ether", types.string)
  .addParam("to", "The unit to convert to", "wei", types.string)
  .setAction(async ({ amount, from, to }, hre) => {
    const valueWei = hre.ethers.parseUnits(`${amount}`, from);
    let result = hre.ethers.formatUnits(valueWei, to);

    const removeTrailingZeroes = /^0*(\d+(?:\.(?:(?!0+$)\d)+)?)/;
    result = result.match(removeTrailingZeroes)![1];

    console.log(`${amount} ${from} to ${to} is <${result}>`);
  });
