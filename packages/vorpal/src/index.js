const vorpal = require('vorpal')();

vorpal
  .command('feed [animal]')
  .autocomplete(['cat', 'dog', 'horse'])
  .option('--day', 'Day of the week to feed', [
    'Monday',
    'Tuesday',
    'Wednesday',
    '...',
  ])
  .action(function (args, callback) {
    console.log(`Running feed:`, args);
    callback();
  });

vorpal.delimiter('$').show();
