import { Contract, ContractTransactionReceipt, EventLog } from "ethers";

function parseLogs(receipt: ContractTransactionReceipt, contract: Contract) {
  const logs = receipt.logs;

  return logs.map((l) => {
    const log = (l as any) as { topics: string[]; data: string };
    const event = contract.interface.parseLog(log);
    return event;
  });
}

export { parseLogs };
