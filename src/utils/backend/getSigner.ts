import { Signer, Wallet } from "ethers";
import { currentNetwork } from "src/config";
import { NetworkData } from "src/types/network";
import getProvider from "./getProvider";

export default async function getSigner(
  network: NetworkData = currentNetwork
): Promise<Signer> {
  const provider = getProvider(network);
  const account = await provider.listAccounts();

  if (account.length === 0) {
    if (!process.env.BACKEND_PRIVATE_KEY) {
      throw new Error("No accounts found");
    }
    return new Wallet(process.env.BACKEND_PRIVATE_KEY, provider);
  }
  return provider.getSigner();
}
