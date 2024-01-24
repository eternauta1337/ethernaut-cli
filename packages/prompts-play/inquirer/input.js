import { input } from 'inquirer';

(async () => {
  const answer = await input({ message: 'Enter your name' });
  console.log(answer);
})();
