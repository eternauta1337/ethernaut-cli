# ethernaut-interact-ui

Ui extensions for the ethernaut-interact package

## What

### contract task

#### Custom prompts

- abi: Presents multiple strategies for specifying a path to the abi of the contract including downloading the abi from etherscan, browsing common abis, etc
- fn: Builds function signatures from the abi
- params: Specialized prompts for collecting smart contract function parameters
- fnERC20: As fn but specific to ERC20 tokens
- paramsERC20: As params but specific to ERC20 tokens

#### Suggestions

- abi: Remembers previous interactions with a given address in a given network and suggests a known abi
- address: Remembers previous interactions with a given abi in a given network and suggests a known address

## Installation

```bash
npm install ethernaut-interact-ui
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-interact-ui')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-interact-ui'
```

## Required plugins

- ethernaut-interact

## Tasks

This plugin does not add any tasks.

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
