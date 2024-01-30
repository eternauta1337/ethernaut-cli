const { extendEnvironment } = require('hardhat/config');
const requireAll = require('utilities/require-all');
const hh = require('./scopes/hh');

requireAll(__dirname, 'scopes');
requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  // Bundle all built in tasks in the hardhat scope
  Object.values(hre.tasks).forEach((task) => {
    if (task.isSubtask) return;
    if (task.scope) return;
    if (task.name === 'navigate') return;
    if (task.name === 'help') return;

    task.scope = 'hh';
    hre.tasks[task.name] = {};

    hh.task(task.name, task.description, task.action);
  });
});
