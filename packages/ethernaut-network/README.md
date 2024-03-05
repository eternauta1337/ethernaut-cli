# hardhat-example-plugin

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

### activate

```
Usage: hardhat [GLOBAL OPTIONS] network activate [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name of the network

activate: Activates a network

For global options help run: hardhat help
```

### add

```
Usage: hardhat [GLOBAL OPTIONS] network add [--non-interactive] [--url <SPECIAL>] [alias]

OPTIONS:

  --non-interactive     Disable interactivity
  --url                 The url of the network provider, e.g. https://ethereum-rpc.publicnode.com. Note: Environment variables may be included, e.g. https://eth-mainnet.alchemyapi.io/v2/${INFURA_API_KEY}. Make sure to specify these in your .env file.

POSITIONAL ARGUMENTS:

  alias The name of the network

add: Adds a network to the cli

For global options help run: hardhat help
```

### current

```
Usage: hardhat [GLOBAL OPTIONS] network current [--non-interactive]

OPTIONS:

  --non-interactive     Disable interactivity

current: Prints the active network

For global options help run: hardhat help
```

### edit

```
Usage: hardhat [GLOBAL OPTIONS] network edit [--non-interactive] [--url <SPECIAL>] [alias]

OPTIONS:

  --non-interactive     Disable interactivity
  --url                 The network url

POSITIONAL ARGUMENTS:

  alias The name of the network

edit: Edits a network

For global options help run: hardhat help
```

### info

```
Usage: hardhat [GLOBAL OPTIONS] network info [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name or url of the network

info: Provides information about a network

For global options help run: hardhat help
```

### list

```
Usage: hardhat [GLOBAL OPTIONS] network list [--non-interactive]

OPTIONS:

  --non-interactive     Disable interactivity

list: Prints all networks

For global options help run: hardhat help
```

### node

```
Usage: hardhat [GLOBAL OPTIONS] network node [--fork <SPECIAL>] [--non-interactive] [--port <SPECIAL>]

OPTIONS:

  --fork                The alias or url of the network to fork (default: "none")
  --non-interactive     Disable interactivity
  --port                The port to run the local chain on (default: "8545")

node: Starts a local development chain, potentially with a fork.

For global options help run: hardhat help
```

### remove

```
Usage: hardhat [GLOBAL OPTIONS] network remove [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name of the network

remove: Removes a network from the cli

For global options help run: hardhat help
```

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
