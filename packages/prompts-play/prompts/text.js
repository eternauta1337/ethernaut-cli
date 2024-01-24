const prompts = require('prompts');

(async () => {
  const response = await prompts([
    {
      type: 'text',
      name: 'value',
      message: 'What is your name?',
    },
  ]);

  console.log(response);
})();
