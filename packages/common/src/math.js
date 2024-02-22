function almostEqual(val1, val2, epsilon = 0.01) {
  return Math.abs(val1 - val2) < epsilon;
}

module.exports = {
  almostEqual,
};
