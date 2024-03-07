# ethernaut-challenges

Tasks for playing the Open Zeppelin Ethernaut challenges from the CLI

## What

This plugin allows to play the challenges through independent commands. The info task provides the instructions of the level, the instance command creates a playable instance, and the submit command allows to submit modified instances to the game's main contract.

## Installation

```bash
npm install ethernaut-challenges
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-challenges')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-challenges'
```

## Required plugins

No other plugins are required.

## Tasks

### info

```
sage: hardhat [GLOBAL OPTIONS] challenges info [level]

POSITIONAL ARGUMENTS:

  level The level number

info: Shows information about an open zeppelin challenges level. The info includes the level name, contract name, ABI path, address, and description. The ABI path can be used with the interact package call task to interact with the contract.

For global options help run: hardhat help
```

### instance

```
Usage: hardhat [GLOBAL OPTIONS] challenges instance [level]

POSITIONAL ARGUMENTS:

  level The level number

instance: Creates an instance of a level, so that it can be played. The address of the instance is printed to the console. Use this address to interact with the contract using the ethernaut-cli contract command. Make sure to use the info command to get instructions on how to complete the level.

For global options help run: hardhat help
```

### submit

```
Usage: hardhat [GLOBAL OPTIONS] challenges submit [address]

POSITIONAL ARGUMENTS:

  address       The address of the instance to submit

submit: Submits an instance created by the instance task, and later manipulated as required by the level. The instance must be submitted to the games main contract in order to complete the level. Use the info command to get instructions on how to complete the level.

For global options help run: hardhat help
```

### check

```
Usage: hardhat [GLOBAL OPTIONS] challenges check [level]

POSITIONAL ARGUMENTS:

  level The level number

check: Checks if the player has completed the specified level by submitting an instance modified as per the levels requirements

For global options help run: hardhat help
```

### check-all

```
Usage: hardhat [GLOBAL OPTIONS] challenges check-all

check-all: Checks all levels that have been completed and submitted by the player

For global options help run: hardhat help
```

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't define any fields in the hardhat config file.

## Usage

There are no additional steps you need to take for this plugin to work.
