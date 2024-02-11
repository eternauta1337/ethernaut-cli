function getFunctionSignature(fnAbi) {
  return `${fnAbi.name || fnAbi.type}(${(fnAbi.inputs || [])
    .map((input) => input?.type)
    .join(',')})`;
}

function getPopulatedFunctionSignature(fnAbi, params) {
  const multiline = !!params && params.length > 0;

  const isWriteCall =
    fnAbi.stateMutability !== 'view' && fnAbi.stateMutability !== 'pure';

  // Collect parameter list
  const parameterDescriptions = [];
  const inputs = fnAbi.inputs || [];
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];

    const valueDescription = params ? `${params[i]}` : '';

    parameterDescriptions.push(
      `${valueDescription.length > 0 ? `${valueDescription} ` : ''}${
        input.type
      }${input.name ? ` ${input.name}` : ''}`
    );
  }

  // Collect return values
  const outputs = fnAbi.outputs || [];
  const outputDescriptions = outputs.map(
    (output) => `${output.type}${output.name ? ` ${output.name}` : ''}`
  );

  // Function name
  let str = `${fnAbi.name || fnAbi.type}${multiline ? '(\n' : '('}`;
  str += `${multiline ? '  ' : ''}${parameterDescriptions.join(
    multiline ? ',\n  ' : ', '
  )}`;
  str += `${multiline ? '\n)' : ')'}`;

  // Function decorators
  if (isWriteCall) {
    str += ` ${fnAbi.stateMutability}`;
  }

  // Return values
  if (outputDescriptions.length > 0) {
    str += ` returns (${outputDescriptions.join(', ')})`;
  }

  return str;
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
