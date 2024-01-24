const prompts = require('prompts');

(async () => {
  const response = await prompts({
  type: 'autocomplete',
  name: 'value',
  message: 'Pick your favorite actor',
  choices: [
    { title: 'Cage' },
    { title: 'Clooney', value: 'silver-fox' },
    { title: 'Gyllenhaal' },
    { title: 'Gibson' },
    { title: 'Grant' }
  ]
});

  console.log(response); // => { value: 24 }
})();
