# ethernaut-network

Tasks for interacting with different networks

## What

As opposed to the traditional approach of using the global option --network in a per-command basis, the ethernaut-cli persists the current active network to a file. So you run a command to set the active network and it will remain the active network in all consecutive commands.

The tasks in this plugin basically allow you to manage this network setting.

## Installation

```bash
npm install ethernaut-network
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-network')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-network'
```

## Required plugins

This plugin doesn't depend on any other plugins.

## Tasks

This plugins adds the following tasks to hardhat:

- activate Activates a network
- add Adds a network to the cli
- current Prints the active network
- edit Edits a network
- info Provides information about a network
- list Prints all networks
- node Starts a local development chain, potentially with a fork
- remove Removes a network from the cli

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
