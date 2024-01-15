function validateURL(value) {
  try {
    new URL(value);
    return true;
  } catch (_) {
    return false;
  }
}

function validateBytes32(value) {
  return value.length === 66 && value.startsWith('0x');
}

module.exports = {
  validateURL,
  validateBytes32,
};
