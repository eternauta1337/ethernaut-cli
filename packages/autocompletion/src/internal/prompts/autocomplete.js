// Adapted from: https://github.com/mokkabonna/inquirer-autocomplete-prompt/blob/master/packages/inquirer-autocomplete-standalone/demo/example.ts
// Author: https://github.com/mokkabonna

const {
  createPrompt,
  isBackspaceKey,
  isEnterKey,
  Separator,
  useEffect,
  useKeypress,
  usePagination,
  usePrefix,
  useRef,
  useState,
} = require('@inquirer/core');
const pc = require('picocolors');
require('@inquirer/type');

const AsyncStatus = {
  Pending: 'pending',
  Done: 'done',
};

function isSelectableChoice(choice) {
  return choice !== null && !Separator.isSeparator(choice) && !choice.disabled;
}

function isUpKey(key) {
  return key.name === 'up';
}

function isDownKey(key) {
  return key.name === 'down';
}

function getValidationMsg(validationError) {
  return validationError ? pc.red(`\n> ${validationError}`) : '';
}

function getDescription(choice) {
  return choice?.description ? pc.dim(`${choice.description}\n`) : '';
}

function getFirstSelectable(choices, cursorPosition = -1, offset = 1) {
  let newCursorPosition = cursorPosition;
  let selectedOption = null;

  const hasSelectable = choices.some((c) => isSelectableChoice(c));
  if (!hasSelectable) {
    return [-1, null];
  }

  while (!isSelectableChoice(selectedOption)) {
    newCursorPosition =
      (newCursorPosition + offset + choices.length) % choices.length;
    selectedOption = choices[newCursorPosition] ?? null;
  }

  return [newCursorPosition, selectedOption];
}

function renderList(choices, cursorPosition, config) {
  const choicesAsString = choices
    .map((choice, index) => {
      if (Separator.isSeparator(choice)) {
        return ` ${choice.separator}`;
      }

      const line = choice.name || choice.value;
      if (choice.disabled) {
        const disabledLabel =
          typeof choice.disabled === 'string' ? choice.disabled : '(disabled)';
        return pc.dim(`- ${line} ${disabledLabel}`);
      }

      if (index === cursorPosition) {
        return pc.cyan(`> ${line}`);
      }

      return `  ${line}`;
    })
    .join('\n');

  return usePagination(choicesAsString, {
    active: cursorPosition,
    pageSize: config.pageSize,
  });
}

module.exports = createPrompt((config, done) => {
  config.suggestOnly ??= false;
  const [searchStatus, setSearchStatus] = useState(AsyncStatus.Pending);
  const [input, setInput] = useState(undefined);
  const [defaultValue = '', setDefaultValue] = useState(config.default);
  const prefix = usePrefix();
  const [isDirty, setIsDirty] = useState(false);
  const [choices, setChoices] = useState([]);
  const [choice, setChoice] = useState(null);
  const [finalValue, setFinalValue] = useState(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const promise = useRef(null);

  const isDone = !!finalValue;

  function search() {
    setSearchStatus(AsyncStatus.Pending);
    setError('');
    setChoice(null);
    setChoices([]);

    let thisPromise;
    try {
      const result = config.source(input);
      thisPromise = Promise.resolve(result);
    } catch (err) {
      thisPromise = Promise.reject(err);
    }

    promise.current = thisPromise;

    thisPromise
      .then((newChoices) => {
        if (promise.current !== null && thisPromise !== promise.current) {
          return;
        }

        if (!Array.isArray(newChoices)) {
          setError(
            'Autocomplete source function must return an array of choices'
          );
          setChoices([]);
          setChoice(null);
          return;
        }

        setChoices(newChoices);

        let [newCursorPosition, firstChoice] = getFirstSelectable(newChoices);

        if (defaultValue) {
          const foundAtIndex = newChoices.findIndex(
            (c) => !Separator.isSeparator(c) && c.value === defaultValue
          );
          if (foundAtIndex > -1) {
            newCursorPosition = foundAtIndex;
            firstChoice = newChoices[foundAtIndex] ?? null;
          }
        }

        setCursorPosition(newCursorPosition);
        setChoice(firstChoice);
        setSearchStatus(AsyncStatus.Done);
      })
      .catch((err) => {
        setError(err.message);
        setSearchStatus(AsyncStatus.Done);
      });
  }

  useEffect(search, [input]);

  async function validateAndSetDone(choice) {
    const validationResult = await config.validate(choice.value);
    if (validationResult !== true) {
      setValidationError(
        validationResult || 'Enter something, tab to autocomplete!'
      );
    } else {
      setDefaultValue(undefined);
      setValidationError('');
      // const value = choice.name || String(choice.value);
      // setFinalValue(value);
      done(choice.value);
    }

    return validationResult;
  }

  useKeypress(async (key, rl) => {
    if (isEnterKey(key)) {
      if (config.suggestOnly) {
        if (!input && defaultValue) {
          const fakeChoice = { value: defaultValue };
          await validateAndSetDone(fakeChoice);
        } else {
          const fakeChoice = { value: input ?? '' };
          await validateAndSetDone(fakeChoice);
        }
      } else if (choice) {
        await validateAndSetDone(choice);
      } else {
        search();
      }
    } else if (isBackspaceKey(key) && !input) {
      setDefaultValue(undefined);
      setInput('');
      setIsDirty(true);
    } else if (key.name === 'tab') {
      if (config.suggestOnly) {
        if (choice) {
          setDefaultValue(undefined);
          rl.clearLine(0);
          const value = String(choice.value);
          const tokens = input.split(' ');
          let res = value + ' ';
          if (tokens.length > 1) {
            const last = tokens.concat().pop();
            if (value.includes(last)) {
              tokens.pop();
            }
            res = tokens.join(' ') + ' ' + res;
          }
          rl.write(res);
          setIsDirty(true);
          setInput(res);
        }
      }
    } else if (isUpKey(key) || isDownKey(key)) {
      const offset = isUpKey(key) ? -1 : 1;
      const [newCursorPosition, firstChoice] = getFirstSelectable(
        choices,
        cursorPosition,
        offset
      );

      setCursorPosition(newCursorPosition);
      setChoice(firstChoice);
    } else {
      setIsDirty(true);
      setInput(rl.line);
      setError('');
    }
  });

  const message = pc.bold(config.message);

  let suggestHelpText = '';
  if (config.suggestOnly) {
    suggestHelpText = ', tab to autocomplete';
  }
  // const listHelpText = pc.dim(
  //   `(Use arrow keys or type to search${suggestHelpText})`
  // );
  const listHelpText = pc.dim(``);

  function transformMaybe(input) {
    if (typeof config.transformer !== 'function') return input;
    return config.transformer(input || '', { isFinal: isDone });
  }

  let formattedValue = transformMaybe(input);

  // function renderPrompt(extra, ...rest) {
  function renderPrompt(
    extra,
    listOrMessage,
    choiceDescription,
    validationMsg
  ) {
    // const firstLine = `${prefix} ${message} ${extra}`;
    const firstLine = `${message} ${extra}`;

    // const below = rest.join('');
    // const below = [statusMessage, choiceDescription, validationMsg].join('');

    return [
      `${firstLine}`,
      `${choiceDescription}${listOrMessage}${validationMsg}`,
    ];
  }

  if (finalValue !== null) {
    return renderPrompt(pc.cyan(transformMaybe(String(finalValue))));
  }

  let firstLineExtra = isDirty ? formattedValue ?? '' : listHelpText;

  if (defaultValue && !isDone && !input) {
    firstLineExtra = pc.dim(`(${defaultValue}) `) + firstLineExtra;
  }

  if (error) {
    return renderPrompt(firstLineExtra, pc.red(`> ${error}`));
  }

  let validationMsg = getValidationMsg(validationError);
  let choiceDescription = getDescription(choice);
  // let choiceDescription = 'Status message...';

  if (searchStatus === AsyncStatus.Pending) {
    return renderPrompt(
      firstLineExtra,
      config.searchText ?? pc.dim('Searching...'),
      choiceDescription,
      validationMsg
    );
  }

  if (!choices.length) {
    return renderPrompt(
      firstLineExtra,
      // config.emptyText ?? pc.yellow('No results...'),
      config.emptyText ?? '',
      choiceDescription,
      validationMsg
    );
  }

  const list = renderList(choices, cursorPosition, config);
  return renderPrompt(firstLineExtra, list, choiceDescription, validationMsg);
});

module.exports.Separator = Separator;
