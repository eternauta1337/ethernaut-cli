const hh = require('./scopes/hh')

module.exports = function bundleLooseTasks() {
  Object.values(_hre.tasks).forEach((task) => {
    if (task.isSubtask) return
    if (task.scope) return
    if (task.name === 'navigate') return
    if (task.name === 'help') return

    task.scope = 'hh'
    _hre.tasks[task.name] = {}

    hh.task(task.name, task.description, task.action)
  })
}
