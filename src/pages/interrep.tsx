import { babyJub, poseidon } from "circomlib";
import semethid from "@interrep/semethid";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

export default function () {
  async function addIdCommitment() {

    var ethereumProvider: any;
    ethereumProvider = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(ethereumProvider);
    const signer = provider.getSigner();

    function sign(message: string): Promise<string> {
      return signer.signMessage(message);
    }

    const identity = await semethid(sign, "github");
    const identityCommitment = poseidon([
      babyJub.mulPointEscalar(identity.keypair.pubKey, 8)[0],
      identity.identityNullifier,
      identity.identityTrapdoor,
    ]).toString();
    console.log("identityCommitment=", identityCommitment);
  }

  return (
    <div>
      <h1>Interrep</h1>
      <button
        onClick={() => {
          addIdCommitment();
        }}
      ></button>
    </div>
  );
}
