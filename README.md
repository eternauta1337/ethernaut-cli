# ethernaut-cli

[![Dynamic JSON Badge](https://img.shields.io/npm/v/ethernaut-cli.svg)](https://www.npmjs.com/package/ethernaut-cli)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/theethernaut/ethernaut-cli/ci.yml)](https://github.com/theethernaut/ethernaut-cli/actions/workflows/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/theethernaut/ethernaut-cli/badge.svg)](https://coveralls.io/github/theethernaut/ethernaut-cli)

The ethernaut-cli is basically an ai agent that is given access to web3 actions through hardhat tasks. It is a cli meant to be installed globally, and used like:

`ethernaut what is the total supply of USDC`

or

`ethernaut complete level 2 of the ethernaut challenges`

It can also be used as a regular cli:

`ethernaut util unit 5 --from ether --to wei`

And also features an interactive mode that allows easy navigation of tasks and collection of task arguments.

## Installation

`npm i -g ethernaut-cli`

Warning!!! This software is in beta, and very experimental atm.

![danger](https://media.giphy.com/media/X8t6i3zOvLfGw/giphy.gif?cid=790b7611j0imei4nyl4pp57rhrk4bjb60d4z2vwc8suct6i1&ep=v1_gifs_search&rid=giphy.gif&ct=g)

## Tutorials

- [Announcing the ethernaut-cli](https://mirror.xyz/theethernaut.eth/0HP3L4mWzb4isXYERfsncBQgzT1T99uQTH8tvJvICmE)

## Intuitive navigation

No more man pages. No more --help.

Just type `ethernaut` and jump straight into an enquirer based navigation mode. Select a scope, select a task, and boom.

<details>
  <summary>Navigation demo</summary>
  ![Enquirer navigation](demos/nav.gif)
</details>

## Smart interactive mode

Once in a task, interactive mode kicks in, and parameters are collected through enquirer prompts.

![Enquirer param collection](demos/interactive.gif)

## Normal CLI interaction

This is still a regular CLI app, so commands can be called without all the fancy ui or ai stuff:

![Normal CLI mode](demos/normal.gif)

## Ui extensions

Plugins of plugins? Why not.

Plugins that enhance parameter collection prompts in other plugins with even cooler prompts, smart suggestions, etc.

For example, the ui extension of the interact plugin can fetch the abi from Etherscan if you didn't provide an abi:

![Etherscan custom abi prompt](demos/custom.gif)

But after you've interacted with the contract, it already has the abi, so the abi is instead suggested:

![Abi suggestion](demos/custom1.gif)

Another example is the extension for the model param in `ethernaut ai config --model`, which queries the openai API and presents a list of available models.

## Natural language to cli commands

If that wasn't easy enough, just type whatever you want and AI will kick in to try to make sense of what you typed, and the right command or sequence of commands will be executed.

![Ai natural language interpretation](demos/interpret.gif)

You want the AI to also teach you how the commands work? Sure.

![Ai command explanation](demos/explain.gif)

You want the AI to also teach you about Ethereum. Also sure.

![Complete level 1](demos/teach.gif)

## Extensibility through hardhat plugins

You don't have to use this entire plethora of features tho. You can use a single feature in your regular hardhat project with exactly what you need. This is because the ethernaut-cli is completely built with hardhat plugins.

You just want task navigation and interactive mode in your project: use the `ethernaut-ui` plugin.

Or the ai stuff: use `ethernaut-ai` plugin.

All the plugins combined conform the ethernaut-cli.

| Title                                                                   | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [ethernaut-ai](packages/title/README.md#ethernaut-ai)                   | AI assistant that interprets user input and executes hardhat tasks      |
| [ethernaut-ai-ui](packages/title/README.md#ethernaut-ai-ui)             | Ui extensions for the ethernaut-ai package                              |
| [ethernaut-cli](packages/title/README.md#ethernaut-cli)                 | Main hardhat project                                                    |
| [ethernaut-challenges](packages/title/README.md#ethernaut-challenges)   | Tasks for playing the Open Zeppelin Ethernaut challenges from the CLI   |
| [ethernaut-common](packages/title/README.md#ethernaut-common)           | Common utils used by several ethernaut-cli plugins                      |
| [ethernaut-interact](packages/title/README.md#ethernaut-interact)       | Tasks for sending transactions and interacting with contracts           |
| [ethernaut-interact-ui](packages/title/README.md#ethernaut-interact-ui) | Ui extensions for the ethernaut-interact package                        |
| [ethernaut-network](packages/title/README.md#ethernaut-network)         | Tasks for interacting with different networks                           |
| [ethernaut-network-ui](packages/title/README.md#ethernaut-network-ui)   | Ui extensions for the ethernaut-network package                         |
| [ethernaut-ui](packages/title/README.md#ethernaut-ui)                   | Intuitive navigation and interactive param collection for hardhat tasks |
| [ethernaut-util](packages/title/README.md#ethernaut-util)               | Simple, everyday utilities for Ethereum devs                            |
| [ethernaut-util-ui](packages/title/README.md#ethernaut-util-ui)         | Ui extensions for the ethernaut-util package                            |
| [ethernaut-wallet](packages/title/README.md#ethernaut-wallet)           | Tasks for interacting from different Ethereum accounts                  |
| [ethernaut-wallet-ui](packages/title/README.md#ethernaut-wallet-ui)     | Ui extensions for the ethernaut-wallet package                          |
