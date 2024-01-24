const { StringPrompt } = require('enquirer');

const prompt = new StringPrompt({
  header: '************************',
  message: 'Input the String:',
  initial: 'Hello',
  footer: '************************',
});

prompt
  .run()
  .then((answer) => console.log('String is:', answer))
  .catch(console.error);
