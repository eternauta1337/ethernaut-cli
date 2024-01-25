const logger = require('../logger.js');
// const { processAction } =require( './actions.js');

async function runThread(assistantId, threadId) {
  const run = await global.openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
  });
  await logger.debug('Creating run:', run.id);

  const completed = await processRun(run, threadId);

  return completed ? await getAssistantResponse(threadId, run.id) : '';
}

// export const stopThread = async (threadId) => {
//   const runs = await global.openai.beta.threads.runs.list(threadId);
//   if (!runs) return;
//   for (const run of runs.body.data) {
//     await logger.debug(`Run ${run.id} status: ${run.status}`);
//   }

//   const activeRuns = runs.body.data.filter(
//     (run) =>
//       run.status === 'in_progress' ||
//       run.status === 'queued' ||
//       run.status === 'requires_action'
//   );
//   if (!activeRuns) return;
//   if (activeRuns.length === 0) return;

//   await logger.debug(`Stopping active runs: ${activeRuns.length}`);

//   for (const run of activeRuns) {
//     await logger.debug(`Stopping ${run.id}`);
//     await global.openai.beta.threads.runs.cancel(threadId, run.id);
//   }
// };

async function getAssistantResponse(threadId, runId) {
  const messages = await global.openai.beta.threads.messages.list(threadId);

  const lastMessage = messages.data
    .filter(
      (message) => message.run_id === runId && message.role === 'assistant'
    )
    .pop();

  return lastMessage.content[0].text.value;
}

async function processRun(run, threadId) {
  const runInfo = await global.openai.beta.threads.runs.retrieve(
    threadId,
    run.id
  );
  // logger.log(JSON.stringify(runInfo, null, 2));
  const { status, required_action } = runInfo;
  logger.debug(status);

  if (status === 'in_progress') {
    // Keep waiting and checking...
  } else if (status === 'requires_action') {
    // await processAction(run, threadId, required_action);
    logger.debug('Action required:', required_action);
  } else if (status === 'completed') {
    return true;
  } else if (status === 'cancelled') {
    return false;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return await processRun(run, threadId);
}

module.exports = {
  runThread,
  // stopThread
};
