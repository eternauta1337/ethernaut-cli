const { ArrayPrompt } = require('enquirer');

const prompt = new ArrayPrompt({
  header: '************************',
  message: 'Input the String:',
  footer: '************************',
  choices: ['a', 'b', 'c'],
});

prompt
  .run()
  .then((answer) => console.log('String is:', answer))
  .catch(console.error);
