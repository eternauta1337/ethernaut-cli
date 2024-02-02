module.exports = function flattenTasks(nodes) {
  return nodes.reduce((flatTasks, node) => {
    if (node.isScope) {
      return [...flatTasks, ...flattenTasks(Object.values(node.tasks))];
    } else {
      return [...flatTasks, node];
    }
  }, []);
};
