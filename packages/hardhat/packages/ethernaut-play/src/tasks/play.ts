import { play } from "../scopes/play";
// TODO: It seems like enquirer is not exporting these types
// See: https://github.com/enquirer/enquirer/issues/448
// @ts-ignore
import { Select } from "enquirer";
import fs from "fs";
import path from "path";
import { parseLogs } from "../internal/events";

import gamedata from "ethernaut/client/src/gamedata/gamedata.json";

play
  .task("play", "Play the Ethernaut challenges (experimental)")
  .setAction(async (taskArgs, hre) => {
    // console.log(hre.network);
    // console.log(gamedata);

    // Pick level
    // const gamedata = JSON.parse(
    //   fs.readFileSync(path.join(__dirname, "../data/gamedata.json"), "utf8")
    // ).levels;
    const choices = gamedata.levels.map((level: any) => {
      return level.name;
    });
    const prompt = new Select({
      name: "level",
      message: "Pick a level",
      limit: 10,
      choices,
    });
    const levelName = await prompt.run();
    const level = gamedata.levels.find(
      (level: any) => level.name === levelName
    );
    if (!level) {
      throw new Error("Level not found");
    }
    const index = gamedata.levels.indexOf(level);
    console.log(`Playing level ${index}: ${level.name}`);
    console.log(level);

    // Show level info
    const ethernautPath = "../../../../../node_modules/ethernaut";
    const info = fs.readFileSync(
      path.join(
        __dirname,
        ethernautPath,
        "client/src/gamedata/en/descriptions/levels",
        `${level.description}`
      ),
      "utf8"
    );
    // console.log(info);

    // Get Ethernaut addresses
    const deploymentData = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          ethernautPath,
          "client/src/gamedata/deploy.sepolia.json"
        ),
        "utf8"
      )
    );
    // console.log(deploymentData);
    const ethernautAddress = deploymentData.ethernaut;
    const levelAddress = deploymentData[`${index}`];
    console.log(levelAddress);

    // Connect to the ethernaut contract
    let artifact = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          ethernautPath,
          "contracts/build/contracts/Ethernaut.sol/Ethernaut.json"
        ),
        "utf8"
      )
    );
    let abi = artifact.abi;
    const ethernaut = await hre.ethers.getContractAt(abi, ethernautAddress);
    // console.log(ethernaut);

    // Create level instance
    const tx = await ethernaut.createLevelInstance(levelAddress);
    const receipt = await tx.wait();
    // console.log("response:", receipt);
    // const logs = parseLogs({ contract: ethernaut, logs: receipt.logs });
    // console.log(logs);
    // console.log("logs:", receipt.logs);
    const events = parseLogs(receipt, ethernaut);
    const createdEvent = events[0];
    const instanceAddress = createdEvent!.args[1];
    console.log(`Instance created ${instanceAddress}`);

    // Interact with the instance
    artifact = JSON.parse(
      fs.readFileSync(
        path.join(
          __dirname,
          ethernautPath,
          `contracts/build/contracts/levels/${level.instanceContract}/${
            level.instanceContract.split(".")[0]
          }.json`
        ),
        "utf8"
      )
    );
    abi = artifact.abi;
    const instance = await hre.ethers.getContractAt(abi, instanceAddress);
    console.log(instance);
    // await interact(instance, hre);
  });

async function pickLevelName() {}
