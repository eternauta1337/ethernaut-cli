# ethernaut-wallet

Tasks for interacting from different Ethereum accounts

## What

In a similar way to the network plugin, this plugin allows to set the wallet to be used to sign messages, send transactions, and interact with contracts in a way that persists between CLI calls.

The tasks in this plugin basically allow you to manage this wallet setting.

## Installation

```bash
npm install ethernaut-wallet
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-wallet')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-wallet'
```

## Required plugins

- [@nomiclabs/hardhat-ethers](https://github.com/nomiclabs/hardhat/tree/master/packages/hardhat-ethers)

## Tasks

This plugins adds the following tasks to hardhat:

- set Sets the active wallet
- add Adds a new wallet
- current Shows which wallet is active
- info Shows information about a wallet
- list Lists all wallets
- remove Removes a wallet
- sign Signs a message with the active wallet

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
