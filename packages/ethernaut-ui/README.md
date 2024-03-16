# ethernaut-ui

Intuitive navigation and interactive param collection for hardhat tasks

![Navigation](../../demos/interactive.gif)

## What

### Interactivity

This plugin traverses all hardhat tasks found in the hardhat runtime environment and makes them interactive.

What is "interactive"? Interactive means that enquirer prompts will be used to collect missing required parameters. E.g. if the `bytes` task is ran without its `value` parameter, the following prompt will be presented:

```
? Enter value (The value to convert): ›
```

Things to know:

- Interactivity can be disabled with the global --non-interactive flag
- Optional parameters and flags are not collected
- There is a bug in hardhat where giving a default parameter to a non-optional parameter makes it optional. The solution used is to set it back to optional right after creation. See the create task in ethernaut-wallet.
- You can define custom prompts for parameters (see ethernaut-interact-ui)
- You can also define suggestions for parameters. Default values are suggested otherwise.

### Navigation

Additionally, when no task is specified, the plugin displays enquirer autocomplete prompts to navigate all available tasks and scopes.

![Navigation](../../demos/nav.gif)

## Installation

```bash
npm install ethernaut-ui
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-ui')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-ui'
```

## Required plugins

This plugin does not require any other plugins.

## Tasks

This plugin adds the following tasks:

- help Used to enter navigation when no tasks are passed
- navigate Navigates tasks and scopes with enquirer

## Environment extensions

This plugin adds the following fields to the hre:

```
hre.ethernaut.ui = {
  nonInteractive: false
}
```

## Configuration

This plugin extends the `HardhatUserConfig`'s `ProjectPathsUserConfig` object with the following fields:

```
config.ethernaut.ui = {
  exclude: {
    scopes: []
    task: ['compile'] // Don't show the compile task
  },
}
```

## Usage

As long as the plugin is required in the project's hardhat config, nothing else is required.

Navigation will be automatically triggered when entering any scope or the root scope, and parameters will be collected whenever they are not provided.
