const { Prompt } = require('enquirer');

class HaiKarate extends Prompt {
  constructor(options = {}) {
    super(options);
    this.value = options.initial || 0;
    this.cursorHide();
  }
  up() {
    this.value++;
    this.render();
  }
  down() {
    this.value--;
    this.render();
  }
  render() {
    this.clear(); // clear previously rendered prompt from the terminal
    this.write(`${this.state.message}: ${this.value}`);
  }
}

// Use the prompt by creating an instance of your custom prompt class.
const prompt = new HaiKarate({
  message: 'How many sprays do you want?',
  initial: 10,
});

prompt
  .run()
  .then((answer) => console.log('Sprays:', answer))
  .catch(console.error);
