const { Option } = require('commander');

class DynamicOption extends Option {
  choices(getChoices) {
    if (typeof getChoices === 'function') {
      super.choices(getChoices());
    } else if (Array.isArray(getChoices)) {
      super.choices(getChoices);
    }
    return this;
  }
}

module.exports = {
  DynamicOption,
};
