require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: {
    compilers: [
      { version: "0.4.18" },
      { version: "0.6.12" },
      { version: "0.7.6" },
      { version: "0.8.7" },
    ]
  }
};