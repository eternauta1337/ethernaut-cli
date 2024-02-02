module.exports = function injectCliExplanation(config, common) {
  config.instructions = config.instructions.replace(
    '[cli-explanation]',
    common['cli-explanation']
  );
};
