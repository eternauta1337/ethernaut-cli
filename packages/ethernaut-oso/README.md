# ethernaut-oso

Tasks for interacting with Open Source Observer, a tool for tracking and analyzing the metrics of open source projects.

## What

This plugin adds a series of tasks that wrap the Open Source Observer API: https://docs.opensource.observer/docs/integrate/api

## Installation

```bash
npm install ethernaut-oso
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-oso')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-oso'
```

## Required plugins

This plugin doesn't depend on any other plugins.

## Tasks

This plugins adds the following tasks to hardhat:

- chain Prints Open Source Observer onchain metrics for a project, including number of contracts, active users, gas usage, and more
- code Prints Open Source Observer code metrics for a project, including number of Github stars, commits, contributors, and more
- find Finds Open Source Observer projects by keyword, listing matches by name and slug

## Environment extensions

This plugin doesn't extend the hre.

## Configuration

This plugin doesn't add any fields to the hardhat configuration file.

## Usage

There are no additional steps you need to take for this plugin to work.
