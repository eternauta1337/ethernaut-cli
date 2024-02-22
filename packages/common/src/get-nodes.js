module.exports = function getNodes(node) {
  return [
    // Merge tasks and scopes
    ...Object.values(node.tasks),
    ...Object.values(node.scopes || {}),
  ]
    .map((node) => {
      // Add is scope property
      node.isScope = !!node.tasks;

      return node;
    })
    .filter((node) => {
      if (node.isScope) return true; // Always include scopes
      if (node.name === undefined) return false; // Exclude null nodes
      return !node.isSubtask; // Exclude subtasks
    });
};
