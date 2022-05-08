const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 7 - Force", function () {

    let deployer, attacker;
    const SOME_ETH = ethers.utils.parseEther("1");

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Force = await ethers.getContractFactory("Force");
        this.contract = await Force.deploy();
        await this.contract.deployed();

        const contractInitialBalance = await ethers.provider.getBalance(this.contract.address);
        expect(contractInitialBalance).to.eq(0);
        console.log(`Contract's initial balance is ${ethers.utils.formatEther(contractInitialBalance)} tokens`);
    });


    it("Send ETH to contract", async function () {

        // Deploy attacking contract that will selfdestruct and send balance to the contract
        const Attack = await ethers.getContractFactory("Attack", attacker);
        const attackContract = await Attack.deploy(this.contract.address);
        await attackContract.deployed();

        // Call the fallback function and send some ETH
        await attacker.sendTransaction({
            to: attackContract.address,
            value: SOME_ETH
        })

        const contractFinalBalance = await ethers.provider.getBalance(this.contract.address);
        expect(contractFinalBalance).to.eq(SOME_ETH);
        console.log(`Contract's final balance is ${ethers.utils.formatEther(contractFinalBalance)} tokens`);
    });

});
