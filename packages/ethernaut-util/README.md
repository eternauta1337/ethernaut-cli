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

- bytes Converts strings to bytes32
- checksum Computes or validates the checksum of an address
- lookup Lookup the address of an ens name
- resolve Resolves an ens name to an address
- string Converts bytes32 to string
- token Tries to find the address of a token, given its name or symbol in the current network
- unit Converts between different units of Ether
- gas Fetch gas info on the current network
- chain Finds a network name from a chain ID, or vice versa
- timestamp Returns the current timestamp adjusted by a given amount of units of time into the future
- date Converts a Unix timestamp to human-readable UTC and local time
- hex Converts integers to hex

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

Just install it and all tasks will be available with `npx hardhat <task> <params>`
