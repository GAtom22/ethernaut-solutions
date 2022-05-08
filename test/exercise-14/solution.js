const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 14 - GatekeeperTwo", function () {

    let deployer, attacker;
    const SOME_ETH = ethers.utils.parseEther("0.01");

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const GatekeeperTwo = await ethers.getContractFactory("GatekeeperTwo");
        this.contract = await GatekeeperTwo.deploy();

        await this.contract.deployed();

        const entrant = await this.contract.entrant();
        expect(entrant).to.be.eq(ethers.constants.AddressZero);
        console.log(`GatekeeperTwo entrant: ${entrant}`);
    });


    it("Register as entrant", async function () {

        // 1- Deploy attacking contract - Send some ETH to use in gas tx
        // Call the enter() function on constructor to pass
        // gate two: assembly { x := extcodesize(caller()) }; require(x == 0);
        // Key is calculated on attacking contract using XOR properties
        const EntrantTwo = await ethers.getContractFactory("EntrantTwo", attacker);
        entrantContract = await EntrantTwo.deploy(this.contract.address, {
            value: SOME_ETH
        });
        await entrantContract.deployed();

        // Check if attacker became entrant
        const entrant = await this.contract.entrant();
        expect(entrant).to.be.eq(attacker.address);
        console.log(`GatekeeperTwo entrant: ${entrant}`);
    });

});

