# ethernaut-interact

Tasks for sending transactions and interacting with contracts

## What

This plugin allows interacting with contracts, and sending transactions.

Note: Enquirer type navigation of ABIs is achieved with ui extensions in the ethernaut-interact-ui plugin.

## Installation

```bash
npm install ethernaut-interact
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-interact')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-interact'
```

## Required plugins

This plugin doesn't depend on any other plugins.

## Tasks

This plugin adds the following tasks:

- find-abi Prints out the absolute paths of the known ABIs
- balance Queries the ETH or TOKEN balance of an address
- contract Interacts with a contract
- info Retrieves information about a contract address using Etherscan, such as the contract name, ABI, and source code
- logs Finds logs emitted by a contract
- send Sends ether to an address
- token Interacts with any ERC20 token
- calldata Decodes calldata from a transaction id

## Environment extensions

This plugin does not add any fields to the hre.

## Configuration

This plugin does not add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
