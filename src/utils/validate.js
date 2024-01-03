function validateURL(value) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  validateURL,
};
