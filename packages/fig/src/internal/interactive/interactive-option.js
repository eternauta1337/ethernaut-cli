const { Option } = require('commander');

class InteractiveOption extends Option {
  preferred(value) {
    this.preferred = value;
    return this;
  }
}

module.exports = {
  InteractiveOption,
};
