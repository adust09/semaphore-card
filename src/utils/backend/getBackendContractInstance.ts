import { Contract } from "ethers";
import { ContractName } from "src/config";
import { getContractInstance } from "src/utils/common/getContractInstance";
import getSigner from "src/utils/backend/getSigner";

export default async function getBackendContractInstance(
  contractName: ContractName,
  signer?: string
): Promise<Contract> {
  const signerInstance = await getSigner(signer);
  return getContractInstance(contractName, signerInstance);
}