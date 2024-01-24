const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

// Function to set up the initial display
function setupInitialDisplay() {
  console.clear(); // Clear the console to start fresh
  console.log('Enter your text:');
  rl.setPrompt('> ');
  rl.prompt();
}

// Function to update the display with character count
function updateDisplay() {
  const currentLine = rl.line;
  readline.cursorTo(process.stdout, 0, 2); // Move to the third line
  readline.clearLine(process.stdout, 0); // Clear the character count line
  process.stdout.write(`Character Count: ${currentLine.length}`); // Write character count
  readline.cursorTo(process.stdout, currentLine.length + 2, 1); // Move cursor back to end of input line
}

// Set up the initial display
setupInitialDisplay();

// Event listener for line input
rl.on('line', () => {
  readline.cursorTo(process.stdout, 0, 1); // Move to the second line
  readline.clearLine(process.stdout, 0); // Clear the input line
  rl.prompt(); // Reset prompt for new input
  readline.cursorTo(process.stdout, 0, 2); // Move to the third line
  readline.clearLine(process.stdout, 0); // Clear the character count line
});

// Event listener for keypress to update the display
rl.input.on('keypress', () => {
  updateDisplay();
});

// Handle exit
process.on('exit', () => {
  rl.close();
});
