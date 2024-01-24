const readline = require('readline');
const input = process.stdin;
const output = process.stdout;

const selectOption = {};

selectOption.selectIndex = 0;
selectOption.options = ['mango', 'banana', 'apple', 'orange'];
selectOption.selector = '*';
selectOption.isFirstTimeShowMenu = true;

const keyPressedHandler = (_, key) => {
  if (key) {
    const optionLength = selectOption.options.length - 1;
    if (key.name === 'down' && selectOption.selectIndex < optionLength) {
      selectOption.selectIndex += 1;
      selectOption.createOptionMenu();
    } else if (key.name === 'up' && selectOption.selectIndex > 0) {
      selectOption.selectIndex -= 1;
      selectOption.createOptionMenu();
    } else if (key.name === 'escape' || (key.name === 'c' && key.ctrl)) {
      selectOption.close();
    }
  }
};

const ansiEraseLines = (count) => {
  //adapted from sindresorhus ansi-escape module
  const ESC = '\u001B[';
  const eraseLine = ESC + '2K';
  const cursorUp = (count = 1) => ESC + count + 'A';
  const cursorLeft = ESC + 'G';

  let clear = '';

  for (let i = 0; i < count; i++) {
    clear += eraseLine + (i < count - 1 ? cursorUp() : '');
  }

  if (count) {
    clear += cursorLeft;
  }

  return clear;
};

const ansiColors = (text, color) => {
  const colors = {
    green: 32,
    blue: 34,
    yellow: 33,
  };
  if (colors[color]) `\x1b[${colors[color]}m${text}\x1b[0m`;
  //default for colors not included
  return `\x1b[32m${text}\x1b[0m`;
};

selectOption.init = () => {
  const question = 'Which of these do you prefer ?';
  console.log(question);

  readline.emitKeypressEvents(input);
  selectOption.start();
};

selectOption.start = () => {
  //setup the input for reading
  input.setRawMode(true);
  input.resume();
  input.on('keypress', keyPressedHandler);

  if (selectOption.selectIndex >= 0) {
    selectOption.createOptionMenu();
  }
};

selectOption.close = () => {
  input.setRawMode(false);
  input.pause();
  process.exit(0);
};

selectOption.getPadding = (num = 10) => {
  let text = ' ';
  for (let i = 0; i < num.length; i++) {
    text += ' ';
  }
  return text;
};

selectOption.createOptionMenu = () => {
  const optionLength = selectOption.options.length;

  if (selectOption.isFirstTimeShowMenu) {
    selectOption.isFirstTimeShowMenu = false;
  } else {
    output.write(ansiEraseLines(optionLength));
  }

  const padding = selectOption.getPadding(20);
  const cursorColor = ansiColors(selectOption.selector, 'green');

  for (let i = 0; i < optionLength; i++) {
    const selectedOption =
      i === selectOption.selectIndex
        ? `${cursorColor} ${selectOption.options[i]}`
        : selectOption.options[i];

    const ending = i !== optionLength - 1 ? '\n' : '';
    output.write(padding + selectedOption + ending);
  }
};

selectOption.init();
