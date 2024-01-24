const prompts = require('prompts');

let allChoices = [
  ['dog', 'cat', 'fish'],
  ['bird', 'whale', 'shark'],
  ['lion', 'tiger', 'bear'],
];

// let commands = [
//   {
//     title: 'util',
//     value: {
//       commands: [{ title: 'unit' }],
//     },
//   },
//   {
//     title: 'interact',
//   },
// ];

allChoices = allChoices.map((arr) => {
  return arr.map((item) => {
    return { title: item };
  });
});

(async () => {
  const response = await prompts({
    type: 'autocomplete',
    name: 'value',
    message: '',
    suggest: (input) => {
      const words = input.split(' ');
      const idx = words.length - 1;
      const newChoices = allChoices[idx].concat([{ title: `idx: ${idx}` }]);
      return Promise.resolve(newChoices);
    },
    choices: allChoices,
  });

  console.log(response); // => { value: 24 }
})();
