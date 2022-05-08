const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 13 - GatekeeperOne", function () {

    let deployer, attacker;
    const SOME_ETH = ethers.utils.parseEther("0.01");

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const GatekeeperOne = await ethers.getContractFactory("GatekeeperOne");
        this.contract = await GatekeeperOne.deploy();

        await this.contract.deployed();

        const entrant = await this.contract.entrant();
        expect(entrant).to.be.eq(ethers.constants.AddressZero);
        console.log(`GatekeeperOne entrant: ${entrant}`);
    });


    it("Register as entrant", async function () {
        // To register, the attacker needs to:
        // 1 - Call enter function from another contract
        // 2 - Tx gas left should be divisible by 8191
        // 3 - gateKey passed should be bytes8 such that:
        //      uint32(uint64(_gateKey)) == uint16(uint64(_gateKey))
        //      uint32(uint64(_gateKey)) != uint64(_gateKey)
        //      uint32(uint64(_gateKey)) == uint16(tx.origin)

        // 1- Deploy attacking contract - Send some ETH to use in gas tx
        const Entrant = await ethers.getContractFactory("Entrant", attacker);
        entrantContract = await Entrant.deploy(this.contract.address, {
            value: SOME_ETH
        });
        await entrantContract.deployed();

        // 2- Tx gas used in 1st modifier consumes 254 wei in gas. 
        // So, will send 81910 + 254 = 82164 wei for gas.
        const gasToUse = 82164;

        // 3- use first 8bytes attacker address (Tx.origin) as gateKey
        // key calculation is done in the attacking contract
        const tx = await entrantContract.enterGate(gasToUse);
        await tx.wait()

        // Check if attacker became entrant
        const entrant = await this.contract.entrant();
        expect(entrant).to.be.eq(attacker.address);
        console.log(`GatekeeperOne entrant: ${entrant}`);
    });

});

