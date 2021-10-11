// Plugins must be loaded with import instead of require.
// You need to explicitly import the Hardhat config functions, like task.
// If you are defining tasks, they need to access the Hardhat Runtime Environment explicitly, as a parameter.

import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

export default {
  solidity: "0.8.4",
  network: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2//${process.env.ALCHEMY_API_KEY}`,
    },
  },
};
