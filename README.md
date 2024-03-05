# ethernaut-cli

Ethereum swiss army ~knife~ ~superweapon~ ~cli~ ~tool~ thing?
for Ethereum hackers.

## Installation

`npm i -g ethernaut-cli`

## Intuitive navigation

No more man pages. No more --help.

Just type `ethernaut` and jump straight into an enquirer based navigation mode. Select a scope, select a task, and boom.

![Enquirer navigation](demos/nav.gif)

## Smart interactive mode

Once in a task, interactive mode kicks in, and all parameters are collected through enquirer prompts.

## Ui extensions

Plugins of plugins? Why not.

Plugins that enhance parameter collection prompts in other plugins with even cooler prompts, smart suggestions, etc.

For example, the ui extension of the interact plugin can fetch the abi from Etherscan if you didn't provide an abi.

## Natural language to cli commands

If that wasn't easy enough, just type whatever you want and AI will kick in to try to make sense of what you typed, and the right command or sequence of commands will be executed.

You want the AI to also teach you how the commands work? Sure.

You want the AI to also teach you about Ethereum. Also sure.

## Extensibility through hardhat plugins

Composable and extensible framework built on top of hardhat. All plugins can be used independetly, or combined together as the ethernaut-cli.

### ethernaut-ai

AI assistant that interprets user input and executes hardhat tasks

### ethernaut-challenges

Tasks for playing the Open Zeppelin Ethernaut challenges from the CLI

### ethernaut-interact

Tasks for sending transactions and interacting with contracts

### ethernaut-interact-ui

Ui expensions for the ethernaut-interact package

### ethernaut-network

Tasks for interacting with different networks

### ethernaut-network-ui

Ui expensions for the ethernaut-network package

### ethernaut-ui

Intuitive navigation and interactive param collection for hardhat tasks

### ethernaut-util

Simple, everyday utilities for Ethereum devs

### ethernaut-util-ui

Ui expensions for the ethernaut-util package

### ethernaut-wallet

Tasks for interacting from different Ethereum accounts

### ethernaut-wallet-ui

Ui expensions for the ethernaut-wallet package

## Additional packages

Apart from plugins, the following packages can also be found on this monorepo.

### ethernaut-cli

Swiss army knife command line application for Ethereum devs

### common

Simple utilities used across all packages in the monorepo
