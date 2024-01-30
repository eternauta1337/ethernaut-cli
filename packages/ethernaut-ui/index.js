const { extendEnvironment } = require('hardhat/config');
const requireAll = require('utilities/require-all');
const hh = require('./scopes/hh');

requireAll(__dirname, 'scopes');
requireAll(__dirname, 'tasks');

extendEnvironment((hre) => {
  makeTasksInteractive(hre);
  bundleLooseTasks(hre);
});

function makeTasksInteractive(node) {
  const children = [
    ...Object.values(node.tasks),
    ...Object.values(node.scopes || {}),
  ];

  children.forEach((c) => {
    if (c.tasks) {
      makeTasksInteractive(c);
    } else if (!c.isSubtask) {
      console.log('Making interactive:', c.name);
    }
  });
}

function bundleLooseTasks(hre) {
  // Bundle loose tasks in the hardhat scope
  Object.values(hre.tasks).forEach((task) => {
    if (task.isSubtask) return;
    if (task.scope) return;
    if (task.name === 'navigate') return;
    if (task.name === 'help') return;

    task.scope = 'hh';
    hre.tasks[task.name] = {};

    hh.task(task.name, task.description, task.action);
  });
}
