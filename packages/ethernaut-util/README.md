# ethernaut-util

Simple, everyday utilities for Ethereum devs

## What

This plugin facilitates a collection of tools for everyday Ethereum development or hacking needs, such as converting between units, searching for logs, converting from and to bytes, etc.

## Installation

```bash
npm install ethernaut-util
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-util')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-util'
```

## Required plugins

This plugin does not require any other plugins.

## Tasks

This plugin adds the tasks listed below.

### bytes

```
Usage: hardhat [GLOBAL OPTIONS] util bytes [value]

POSITIONAL ARGUMENTS:

  value The value to convert. Will always be treated as a string. Cannot be longer than a bytes32 string.

bytes: Converts strings to bytes32

For global options help run: hardhat help
```

### checksum

```
Usage: hardhat [GLOBAL OPTIONS] util checksum [address]

POSITIONAL ARGUMENTS:

  address       The address whose checksum will be computed. If the address contains mixed case characters, its checksum will be validated.

checksum: Computes or validates the checksum of an address

For global options help run: hardhat help
```

### lookup

```
Usage: hardhat [GLOBAL OPTIONS] util lookup [address]

POSITIONAL ARGUMENTS:

  address       The address to lookup

lookup: Lookup the address of an ens name

For global options help run: hardhat help
```

### resolve

```
Usage: hardhat [GLOBAL OPTIONS] util resolve [name]

POSITIONAL ARGUMENTS:

  name  The ens name to resolve

resolve: Resolves an ens name to an address

For global options help run: hardhat help
```

### string

```
Usage: hardhat [GLOBAL OPTIONS] util string [value]

POSITIONAL ARGUMENTS:

value The value to convert

string: Converts bytes32 to string

For global options help run: hardhat help
```

### token

```
Usage: hardhat [GLOBAL OPTIONS] interact token-address [--chain <SPECIAL>] [name]

OPTIONS:

  --chain       The name or id of the network to search on. Use "0" to only search on the current network. Use "-1" to search on any network. Default is "0" (current network) (default: "0")

POSITIONAL ARGUMENTS:

  name  The name or symbol of the token

token-address: Tries to find the address of a token, given its name or symbol in the current network

For global options help run: hardhat help
```

### unit

```
Usage: hardhat [GLOBAL OPTIONS] util unit [--from <SPECIAL>] [--to <SPECIAL>] [value]

OPTIONS:

  --from        The unit to convert from (default: "ether")
  --to          The unit to convert to (default: "wei")

POSITIONAL ARGUMENTS:

  value The value to convert

unit: Converts between different units of Ether. E.g. 1 ether is 1000000000000000000 wei. Units can be a number, or one of ether,wei,kwei,mwei,gwei,szabo,finney.

For global options help run: hardhat help
```

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

Just install it and all tasks will be available with `npx hardhat <task> <params>`
