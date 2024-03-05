# ethernaut-util-ui

Ui extensions for the ethernaut-util package

## What

### Unit task

- from: Prompt with list of common units like ether, wei, kwei, etc
- to: Prompt with list of common units like ether, wei, kwei, etc

## Installation

```bash
npm install ethernaut-util-ui
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-util-ui')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-util-ui'
```

## Required plugins

- ethernaut-util

## Tasks

This plugin does not add any tasks.

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

Simply require the plugin in hardhat.config.js and the custom prompts will replace the generic prompts that ship with the ethernaut-util plugin.
