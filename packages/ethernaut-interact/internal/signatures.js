const chalk = require('chalk');

function getFunctionSignature(fnAbi) {
  return `${fnAbi.name}(${fnAbi.inputs.map((input) => input.type).join(',')})`;
}

function getPopulatedFunctionSignature(fnAbi, params) {
  const multiline = !!params && params.length > 0;

  const isWriteCall =
    fnAbi.stateMutability !== 'view' && fnAbi.stateMutability !== 'pure';

  // Collect parameter list
  const parameterDescriptions = [];
  for (let i = 0; i < fnAbi.inputs.length; i++) {
    const input = fnAbi.inputs[i];

    const valueDescription = params ? `${params[i]}` : '';

    parameterDescriptions.push(
      `${valueDescription} /*${input.type} ${input.name}*/`
    );
  }

  // Collect return values
  const outputDescriptions = fnAbi.outputs.map(
    (output) => `${output.type}${output.name ? ` ${output.name}` : ''}`
  );

  // Function name
  let str = `${fnAbi.name}${multiline ? '(\n' : '('}`;
  str += `${multiline ? '  ' : ''}${parameterDescriptions.join(
    multiline ? ',\n  ' : ', '
  )}`;
  str += `${multiline ? '\n)' : ')'}`;

  // Function decorators
  if (!isWriteCall) {
    str += ` ${fnAbi.stateMutability}`;
  }

  // Return values
  if (outputDescriptions.length > 0) {
    str += ` returns (${outputDescriptions.join(', ')})`;
  }

  return isWriteCall ? chalk.yellowBright.bold(str) : str;
}

function getFullEventSignature(eventAbi, event) {
  let i = 0;

  const namedArgs = event.args.map((arg) => {
    const input = eventAbi.inputs[i];
    i++;

    return `${input.type} ${input.name} = ${arg}`;
  });

  let str = `${event.name}(\n`;
  str += `  ${namedArgs.join(',\n  ')}`;
  str += '\n)';

  return str;
}

module.exports = {
  getFunctionSignature,
  getPopulatedFunctionSignature,
  getFullEventSignature,
};
