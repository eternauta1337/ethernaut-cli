# ethernaut-ai

AI assistant that interprets user input and executes hardhat tasks

## What

This plugin exposes all hardhat tasks to ChatGPT using the OpenAI assistants api, effectively producing an agent that knows how to use all the hardhat tasks in your project.

Additionally, the assistant can be used to explain why a particular natural language query was interpreted to a given command, or how the command itself works.

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

This plugin adds the _interpret_ task to Hardhat:

```
Usage: hardhat [GLOBAL OPTIONS] ai interpret [--model <SPECIAL>] [--new-thread] [--no-confirm] [--non-interactive] [query]

OPTIONS:

  --model               The model to use (default: "assistant-defined")
  --new-thread          Start a new thread
  --no-confirm          Always execute the command without prompting
  --non-interactive     Disable interactivity

POSITIONAL ARGUMENTS:

  query The natural language query to convert to CLI commands

interpret: Interprets natural language into CLI commands

For global options help run: hardhat help
```

## Environment extensions

This plugin doesn't add any fields to the hre.

## Configuration

<_A description of each extension to the HardhatConfig or to its fields_>

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

<_A description of how to use this plugin. How to use the tasks if there are any, etc._>

The plugin pre-parses input, so you can just type what you need:

```
npx hardhat I need to compile this project
```

However, if you need more fine grained control, you can use the `interpret` task within the `ai` scope:

```
npx hardhat ai interpret "I need to compile this project"
```
