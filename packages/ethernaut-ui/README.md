# ethernaut-ui

Intuitive navigation and interactive param collection for hardhat tasks

![Navigation](../../demos/interactive.gif)

## What

### Interactivity

This plugin traverses all hardhat tasks found in the hardhat runtime environment and makes them interactive. This means that when a task is called without one of its parameters, it will display an enquirer prompt to collect the value.

Things to know:

- Interactivity can be disabled with the global --non-interactive flag
- Required parameters are also optional in interactive mode
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

### navigate

```
Usage: hardhat [GLOBAL OPTIONS] navigate [scope]

POSITIONAL ARGUMENTS:

  scope The group of tasks to navigate. Defaults to the root scope

navigate: Navigates tasks with enquirer
```

### help (overridden)

Since this is the task that is called by default by hardhat when non is specified, this plugin overrides it so that `npx hardhat` enters navigation, as well as `npx hardhat <scope>`.

`npx hardhat help` triggers the original functionality.

The override also allows to show --non-interactive as one of the global parameters.

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
