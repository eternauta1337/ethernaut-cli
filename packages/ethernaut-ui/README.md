# ethernaut-ui

Intuitive navigation and interactive param collection for hardhat tasks

![Navigation](../../demos/interactive.gif)

## What

### Interactivity

This plugin traverses all hardhat tasks found in the hardhat runtime environment and makes them interactive. This means that when a task is called without one of its parameters, it will display an enquirer prompt to collect the value.

Things to know:

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

This plugin does not add any tasks.

## Environment extensions

This plugin doesn't add any fields to the hre.

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
