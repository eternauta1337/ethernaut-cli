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

### contract

```
Usage: hardhat [GLOBAL OPTIONS] interact contract [--abi <SPECIAL>] [--address <SPECIAL>] [--fn <SPECIAL>] [--no-confirm] [--non-interactive] [--params <SPECIAL>] [--value <SPECIAL>]

OPTIONS:

  --abi                 The path to a json file specifying the abi of the contract
  --address             The address of the contract
  --fn                  The function of the contract to call
  --no-confirm          Skip confirmation prompts, avoiding any type of interactivity
  --non-interactive     Disable interactivity
  --params              The parameters to use in the function call. If the call requires multiple parameters, separate them with a comma. E.g. "0x123,42"
  --value               The amount of ether to send with the transaction

contract: Interacts with a contract

For global options help run: hardhat help
```

### send

```
Usage: hardhat [GLOBAL OPTIONS] interact send [--address <SPECIAL>] [--no-confirm] [--non-interactive] [--value <SPECIAL>]

OPTIONS:

  --address             The address that will receive the ether
  --no-confirm          Skip confirmation prompts, avoiding any type of interactivity
  --non-interactive     Disable interactivity
  --value               The amount of ether to send with the transaction. Warning! The value is in ether, not wei.

send: Sends ether to an address

For global options help run: hardhat help
```

## Environment extensions

This plugin does not add any fields to the hre.

## Configuration

This plugin does not add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.