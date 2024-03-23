# ethernaut-cli

[![Dynamic JSON Badge](https://img.shields.io/npm/v/ethernaut-cli.svg)](https://www.npmjs.com/package/ethernaut-cli)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/theethernaut/ethernaut-cli/ci.yml)](https://github.com/theethernaut/ethernaut-cli/actions/workflows/ci.yml)
[![codecov](https://codecov.io/github/theethernaut/ethernaut-cli/graph/badge.svg?token=ZBKMD0BTEU)](https://codecov.io/github/theethernaut/ethernaut-cli)

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

## Packages

| Title                                                                   | Description                                                             | Coverage                                                                                                                                                                                           |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ethernaut-ai](packages/title/README.md#ethernaut-ai)                   | AI assistant that interprets user input and executes hardhat tasks      | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-ai)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-ai)                   |
| [ethernaut-ai-ui](packages/title/README.md#ethernaut-ai-ui)             | Ui extensions for the ethernaut-ai package                              | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-ai-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-ai-ui)             |
| [ethernaut-cli](packages/title/README.md#ethernaut-cli)                 | Main hardhat project                                                    | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-cli)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-cli)                 |
| [ethernaut-challenges](packages/title/README.md#ethernaut-challenges)   | Tasks for playing the Open Zeppelin Ethernaut challenges from the CLI   | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-challenges)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-challenges)   |
| [ethernaut-common](packages/title/README.md#ethernaut-common)           | Common utils used by several ethernaut-cli plugins                      | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-common)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-common)           |
| [ethernaut-interact](packages/title/README.md#ethernaut-interact)       | Tasks for sending transactions and interacting with contracts           | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-interact)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-interact)       |
| [ethernaut-interact-ui](packages/title/README.md#ethernaut-interact-ui) | Ui extensions for the ethernaut-interact package                        | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-interact-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-interact-ui) |
| [ethernaut-network](packages/title/README.md#ethernaut-network)         | Tasks for interacting with different networks                           | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-network)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-network)         |
| [ethernaut-network-ui](packages/title/README.md#ethernaut-network-ui)   | Ui extensions for the ethernaut-network package                         | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-network-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-network-ui)   |
| [ethernaut-ui](packages/title/README.md#ethernaut-ui)                   | Intuitive navigation and interactive param collection for hardhat tasks | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-ui)                   |
| [ethernaut-util](packages/title/README.md#ethernaut-util)               | Simple, everyday utilities for Ethereum devs                            | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-util)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-util)               |
| [ethernaut-util-ui](packages/title/README.md#ethernaut-util-ui)         | Ui extensions for the ethernaut-util package                            | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-util-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-util-ui)         |
| [ethernaut-wallet](packages/title/README.md#ethernaut-wallet)           | Tasks for interacting from different Ethereum accounts                  | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-wallet)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-wallet)           |
| [ethernaut-wallet-ui](packages/title/README.md#ethernaut-wallet-ui)     | Ui extensions for the ethernaut-wallet package                          | [![codecov](https://codecov.io/gh/theethernaut/ethernaut-cli/branch/main/graph/badge.svg?flag=ethernaut-wallet-ui)](https://codecov.io/gh/theethernaut/ethernaut-cli?flag=ethernaut-wallet-ui)     |

## Tutorials

- [Announcing the ethernaut-cli](https://mirror.xyz/theethernaut.eth/0HP3L4mWzb4isXYERfsncBQgzT1T99uQTH8tvJvICmE)

## Intuitive navigation

No more man pages. No more --help.

Just type `ethernaut` and jump straight into an enquirer based navigation mode. Select a scope, select a task, and boom.

![Enquirer navigation](demos/nav.gif)

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

Interesting toy ain't it?

You don't have to use this entire plethora of features tho. You can use a single feature in your regular hardhat project with exactly what you need. This is because the ethernaut-cli is completely built with hardhat plugins.

You just want task navigation and interactive mode in your project: use the `ethernaut-ui` plugin.

Or the ai stuff: use `ethernaut-ai` plugin.

All the plugins combined conform the ethernaut-cli.
