# ethernaut-ai

AI assistant that interprets user input and executes hardhat tasks

![Ai natural language interpretation](../../demos/interpret.gif)

## What

This plugin exposes all hardhat tasks to ChatGPT using the OpenAI assistants api, effectively producing an agent that knows how to use all the hardhat tasks in your project.

Additionally, the assistant can be used to explain why a particular natural language query was interpreted to a given command, or how the command itself works.

![Explain commands](../../demos/explain.gif)

The assistant is automatically rebuilt whenever any of the task descriptions or parameters change.

## Installation

```bash
npm install ethernaut-ai
```

Import the plugin in your `hardhat.config.js`:

```js
require('ethernaut-ai')
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import 'ethernaut-ai'
```

Note: This plugin will look for an OPENAI_API_KEY in the current working directory's .env file. When required tho, the plugin will use a prompt to collect the key.

## Required plugins

No other plugins are required.

## Tasks

This plugin adds the following tasks to hardhat:

- config Configures ai scope parameters
- interpret Interprets natural language into CLI commands

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

This plugin extends the `HardhatUserConfig`'s `ProjectPathsUserConfig` object with the following fields:

```
config.ethernaut.ai = {
  interpreter: {
    additionalInstructions: ['Always talk like a pirate']
  },
  explainer: {
    additionalInstructions: ['Dont be boring']
  },
}
```

## Usage

The plugin pre-parses input, so you can just type what you need:

```
npx hardhat I need to compile this project
```

However, if you need more fine grained control, you can use the `interpret` task within the `ai` scope:

```
npx hardhat ai interpret "I need to compile this project" --new-thread --no-confirm
```
