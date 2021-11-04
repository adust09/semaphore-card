import { Contract } from "ethers";
import { ContractName } from "src/config";
import getContractInstance from "src/utils/common/getContractInstance";
import getSigner from "src/utils/backend/getSigner";

export default async function getBackendContractInstance(
  contractName: ContractName,
  contractAddress: string
): Promise<Contract> {
  const contractInstance = getContractInstance(contractName, contractAddress);
  const signer = await getSigner();

  return contractInstance.connect(signer);
}
