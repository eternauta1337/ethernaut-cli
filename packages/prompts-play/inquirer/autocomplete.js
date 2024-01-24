async function main() {
  const { default: autocomplete, Separator } = await import(
    'inquirer-autocomplete-standalone'
  );

  const answer = await autocomplete({
    message: '',
    suggestOnly: true,
    source: async (input) => {
      const choices = [
        { value: 'convert', description: 'Convert between different units' },
        { value: 'interact', description: 'Interact with any contract' },
        { value: 'set-provider', description: 'Choose a network provider' },
      ];

      if (!input) return choices;

      return choices.filter((c) => c.value.includes(input));
    },
  });
  console.log(answer);
}

main();
