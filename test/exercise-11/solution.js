const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Exercise 11 - Elevator", function () {

    let deployer, attacker;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();

        const Elevator = await ethers.getContractFactory("Elevator");
        this.contract = await Elevator.deploy();
        await this.contract.deployed();
    });


    it("Use elevator using a corrupted Building contract to go to last floor", async function () {
        // Deploy a building contract, passing it the elevator address 
        // function on its fallback
        const Building = await ethers.getContractFactory("Building", attacker);

        const buildingContract = await Building.deploy(this.contract.address);
        await buildingContract.deployed();

        // Go to any floor, should return that we at the top
        // when we check
        const goToTx = await buildingContract.goTo(1);
        await goToTx.wait();
        const isLastFloor = await this.contract.connect(attacker).top();

        expect(isLastFloor).to.be.true;
    });

});
