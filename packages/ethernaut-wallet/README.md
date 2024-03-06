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

### activate

```
Usage: hardhat [GLOBAL OPTIONS] wallet activate [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name of the wallet

activate: Activates a wallet

For global options help run: hardhat help
```

### create

```
Usage: hardhat [GLOBAL OPTIONS] wallet create [--non-interactive] [--pk <SPECIAL>] [alias]

OPTIONS:

  --non-interactive     Disable interactivity
  --pk                  The private key of the wallet or "random". Pass "random" or an empty string to generate a private key. (default: "random")

POSITIONAL ARGUMENTS:

  alias The name of the wallet

create: Creates a new wallet

For global options help run: hardhat help
```

### current

```
Usage: hardhat [GLOBAL OPTIONS] wallet current [--non-interactive]

OPTIONS:

  --non-interactive     Disable interactivity

current: Shows which wallet is active

For global options help run: hardhat help
```

### info

```
Usage: hardhat [GLOBAL OPTIONS] wallet info [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name of the wallet

info: Shows information about a wallet

For global options help run: hardhat help
```

### list

```
Usage: hardhat [GLOBAL OPTIONS] wallet list [--non-interactive]

OPTIONS:

  --non-interactive     Disable interactivity

list: Lists all wallets

For global options help run: hardhat help
```

### remove

```
Usage: hardhat [GLOBAL OPTIONS] wallet remove [--non-interactive] [alias]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  alias The name of the wallet

remove: Removes a wallet

For global options help run: hardhat help
```

### sign

```
Usage: hardhat [GLOBAL OPTIONS] wallet sign [--non-interactive] [message]

OPTIONS:

  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  message       The message to sign

sign: Signs a message with the active wallet

For global options help run: hardhat help
```

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
