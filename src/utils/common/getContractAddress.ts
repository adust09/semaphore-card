import { OAuthProvider } from "@interrep/reputation-criteria";
import { contractAddresses, ContractName, currentNetwork } from "src/config";

export default function getContractAddress(
  contractName: ContractName,
  provider?: OAuthProvider
): string {
  if (contractName === ContractName.INTERREP_GROUPS) {
    return contractAddresses[currentNetwork.chainId][
      ContractName.INTERREP_GROUPS
    ];
  }

  if (!provider) {
    throw new Error(
      `You must specify a OAuth provider to obtain a ${contractName} address`
    );
  }

  return contractAddresses[currentNetwork.chainId][
    ContractName.REPUTATION_BADGE
  ][provider];
}
