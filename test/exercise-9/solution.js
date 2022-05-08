const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');

describe("Exercise 9 - King", function () {

    let deployer, attacker;
    const INITIAL_PRIZE = ethers.utils.parseUnits('10', 'ether');

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const King = await ethers.getContractFactory("King");
        this.contract = await King.deploy({
            value: INITIAL_PRIZE
        });
        await this.contract.deployed();

        expect(await this.contract._king()).to.eq(deployer.address);
    });


    it("Avoid reclaiming Kingship", async function () {

        // Deploy an attacking contract that will remain as the last king 
        // because it will revert when the King contract tries to transfer funds
        const LastKing = await ethers.getContractFactory("LastKing", attacker);

        const lastKingContract = await LastKing.deploy(this.contract.address);
        await lastKingContract.deployed();

        // Send enough ETH to become King
        const tx = await lastKingContract.connect(attacker).claimThrone({
            value: ethers.utils.parseUnits('12', 'ether')
        })
        await tx.wait()

        // then, last king contract should be the new king
        expect(await this.contract._king()).to.eq(lastKingContract.address);

        // Deployer tries to reclaim kingship but tx is reverted
        try {
            await deployer.sendTransaction({
                to: this.contract.address,
                value: ethers.utils.parseUnits('15', 'ether')
            })
        } catch (error) {
            // The error that reverts the transaction should contain
            // the error message that LastKing throws
            expect(error.message).to.contain("Cannot do this, my friend");
        }

        // Check that last king contract is still the attacking contract
        expect(await this.contract._king()).to.eq(lastKingContract.address);
    });

});
