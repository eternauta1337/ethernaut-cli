const isAddress = (str) => {
  const regex = /^0x[a-fA-F0-9]{40}$/;
  return regex.test(str);
};

const containsAddress = (str) => {
  const regex = /0x[a-fA-F0-9]{40}(?![a-fA-F0-9])/;
  return regex.test(str);
};

const extractAddress = (str) => {
  const regex = /0x[a-fA-F0-9]{40}/;
  const match = str.match(regex);
  return match ? match[0] : null;
};

module.exports = {
  isAddress,
  containsAddress,
  extractAddress,
};
