const { log } = require('../logger');
const { parseInput } = require('./parse-input');
const { flattenCommands } = require('./flatten-commands');
const { getCommandPath } = require('./command-path');

function suggest(program) {
  return async (input) => {
    const { matchedCommand, matchedOption, lastToken } = await parseInput(
      program,
      input
    );
    await log(`>${lastToken}<`);
    // await log('matchedCommand:', matchedCommand.name());
    // await log('matchedOption:', matchedOption);

    let choices = [];

    if (matchedCommand.commands.length > 0) {
      choices = suggestSubcommands(matchedCommand, lastToken);
    } else {
      if (matchedOption) {
        choices = suggestOption(matchedCommand, matchedOption);
      } else {
        choices = suggestOptions(matchedCommand, input, lastToken);
      }
    }

    return choices;
  };
}

function suggestOption(command, option) {
  let choices = [];

  if (option.argChoices) {
    choices = option.argChoices.map((c) => {
      return {
        name: c,
        value: c,
        description: command.usage(),
      };
    });
  }

  return choices;
}

function suggestOptions(command, input) {
  let choices = [];

  choices = optionsAsChoices(command);

  choices = choices.filter((c) => !input.includes(c.value));

  return choices;
}

function optionsAsChoices(command) {
  const choices = [];

  for (let i = 0; i < command.options.length; i++) {
    const o = command.options[i];

    const oName = o.long.split('--')[1];

    choices.push({
      name: `${oName} - ${o.description}`,
      value: o.long,
      description: command.usage(),
    });
  }

  return choices;
}

function suggestSubcommands(command, lastToken) {
  let choices = [];

  const msg =
    command.name() === 'ethernaut' ? 'Choose a command' : 'Choose a subcommand';
  choices = subcommandsAsChoices(command, msg);

  if (lastToken && lastToken !== command.name()) {
    choices = choices.filter((c) => c.value.includes(lastToken));
  }

  return choices;
}

function subcommandsAsChoices(command, message) {
  const choices = [];

  const subcommands = flattenCommands(command.commands);

  for (let i = 0; i < subcommands.length; i++) {
    const c = subcommands[i];

    choices.push({
      name: `${c.name()} - ${c.description()}`,
      value: getCommandPath(c).join(' '),
      description: message,
    });
  }

  return choices;
}

module.exports = {
  suggest,
};
